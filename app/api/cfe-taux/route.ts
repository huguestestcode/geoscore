import { NextRequest, NextResponse } from 'next/server'
import { ANNEE_TAUX, TAUX_CONNUS } from './taux-data'

// ── Cache ─────────────────────────────────────────────────────────────────────
const cache = new Map<string, { taux: number; nom: string; annee: number; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide (5 chiffres attendus)' }, { status: 400 })
  }

  // 1. Cache
  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // 2. Données hardcodées (instantané, fiable)
  const known = TAUX_CONNUS[code]
  if (known) {
    const result = { taux: known.taux, nom: known.nom, annee: ANNEE_TAUX, source: `DGFiP REI ${ANNEE_TAUX}`, fetchedAt: Date.now() }
    cache.set(code, result)
    return NextResponse.json(result)
  }

  // 3. REI complet DGFiP (toutes communes)
  try {
    const r = await fetchREIComplet(code)
    if (r) {
      const result = { taux: r.taux, nom: r.nom, annee: ANNEE_TAUX, source: 'DGFiP REI — data.economie.gouv.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-taux] REI complet failed:', e) }

  // 4. Extraits data.economie.gouv.fr
  for (const ds of ['fiscalite-locale-des-entreprises', 'fiscalite-locale-des-entreprises-copie']) {
    try {
      const r = await fetchEconomieDataset(code, ds)
      if (r) {
        const result = { taux: r.taux, nom: r.nom, annee: ANNEE_TAUX, source: `DGFiP — ${ds}`, fetchedAt: Date.now() }
        cache.set(code, result)
        return NextResponse.json(result)
      }
    } catch (e) { console.error(`[cfe-taux] ${ds} failed:`, e) }
  }

  // 5. OFGL REI (format long, filtre côté client)
  try {
    const r = await fetchOFGL(code)
    if (r) {
      const result = { taux: r.taux, nom: r.nom, annee: r.annee, source: 'OFGL — data.ofgl.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-taux] OFGL failed:', e) }

  return NextResponse.json({ error: `Taux CFE non trouvé pour le code INSEE ${code}.` }, { status: 404 })
}

// ── Fetchers API ──────────────────────────────────────────────────────────────

async function fetchREIComplet(code: string): Promise<{ taux: number; nom: string } | null> {
  const DS = 'impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir'
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DS}/records`
  for (const field of ['codgeo', 'code_commune', 'code_insee']) {
    for (const val of [`"${code}"`, code]) {
      try {
        const res = await fetch(`${base}?where=${encodeURIComponent(`${field}=${val}`)}&limit=3`, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) continue
        const data = await res.json()
        const results: unknown[] = data.results || data.records || []
        if (!results.length) continue
        const rec = unwrap(results[0])
        console.log(`[cfe] REI field=${field} val=${val} keys:`, Object.keys(rec).slice(0, 20).join(','))
        const taux = extractCFETaux(rec)
        if (taux && taux > 0) return { taux, nom: extractNom(rec) }
      } catch { continue }
    }
  }
  return null
}

async function fetchEconomieDataset(code: string, ds: string): Promise<{ taux: number; nom: string } | null> {
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${ds}/records`
  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    try {
      const res = await fetch(`${base}?where=${encodeURIComponent(`${field}="${code}"`)}&limit=5`, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue
      const rec = unwrap(results[0])
      console.log(`[cfe] ${ds} field=${field} keys:`, Object.keys(rec).slice(0, 20).join(','))
      const taux = extractCFETaux(rec)
      if (taux && taux > 0) return { taux, nom: extractNom(rec) }
    } catch { continue }
  }
  return null
}

async function fetchOFGL(code: string): Promise<{ taux: number; nom: string; annee: number } | null> {
  const base = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'
  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    try {
      const res = await fetch(
        `${base}?where=${encodeURIComponent(`${field}="${code}"`)}&limit=50&order_by=annee%20desc`,
        { signal: AbortSignal.timeout(10000) }
      )
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue

      console.log(`[cfe] OFGL field=${field} rows=${results.length} sample:`, JSON.stringify(unwrap(results[0])).slice(0, 200))

      const cfeTaux = results.filter((r) => {
        const rec = unwrap(r)
        const d = String(rec.dispositif_fiscal ?? '').toLowerCase()
        const c = String(rec.categorie ?? '').toLowerCase()
        return (d.includes('cfe') || d.includes('cotisation fonci')) && c.includes('taux')
      })

      if (!cfeTaux.length) {
        console.warn(`[cfe] OFGL no CFE/taux rows for ${code}:`, results.slice(0, 2).map(r => {
          const rec = unwrap(r); return `d=${rec.dispositif_fiscal} c=${rec.categorie}`
        }).join(' | '))
        continue
      }

      const byYear = new Map<number, { total: number; nom: string }>()
      for (const r of cfeTaux) {
        const rec = unwrap(r)
        const annee = toNum(rec.annee); if (!annee) continue
        const montant = toNum(rec.montant ?? rec.valeur ?? rec.taux); if (!montant || montant <= 0) continue
        const nom = String(rec.nom_commune ?? rec.lib_commune ?? rec.libelle_commune ?? '')
        const ex = byYear.get(annee)
        if (ex) ex.total += montant
        else byYear.set(annee, { total: montant, nom })
      }
      if (!byYear.size) continue
      const yr = Math.max(...byYear.keys())
      const { total, nom } = byYear.get(yr)!
      return { taux: Math.round(total * 100) / 100, nom, annee: yr }
    } catch { continue }
  }
  return null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function unwrap(r: unknown): Record<string, unknown> {
  if (r && typeof r === 'object') {
    const o = r as { fields?: Record<string, unknown> }
    return o.fields ?? (r as Record<string, unknown>)
  }
  return {}
}

function toNum(v: unknown): number | null {
  if (typeof v === 'number') return v
  if (typeof v === 'string') { const n = parseFloat(v.replace(',', '.')); return isNaN(n) ? null : n }
  return null
}

function extractCFETaux(f: Record<string, unknown>): number | null {
  for (const k of ['taux_cfe_hz','taux_cfe','cfe_hz','cfe_taux_hz','cfe_taux','taux_global_cfe_hz','taux_global_cfe','txg_cfe_hz','txg_cfe','tx_cfe_hz','tx_cfe','txcfe_hz','txcfe']) {
    if (k in f) { const n = toNum(f[k]); if (n && n > 0) return n }
  }
  for (const [k, v] of Object.entries(f)) {
    if (k.toLowerCase().includes('cfe')) { const n = toNum(v); if (n && n > 0 && n < 100) return n }
  }
  return null
}

function extractNom(f: Record<string, unknown>): string {
  for (const k of ['libgeo','nom_commune','lib_commune','libelle_commune','nom','commune','libelle']) {
    if (k in f && typeof f[k] === 'string') return f[k] as string
  }
  return ''
}
