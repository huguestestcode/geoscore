import { NextRequest, NextResponse } from 'next/server'

const cache = new Map<string, { taux: number; nom: string; annee: number; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide (5 chiffres attendus)' }, { status: 400 })
  }

  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // ── Source 1 : fichier REI complet DGFiP (toutes communes) ─────────────────
  // Format large : une ligne par commune, colonnes taux_cfe_*, txg_cfe_*, etc.
  try {
    const r = await fetchREIComplet(code)
    if (r) {
      const result = { taux: r.taux, nom: r.nom, annee: 2024, source: 'DGFiP REI — data.economie.gouv.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-taux] REI complet failed:', e) }

  // ── Source 2 : extrait "fiscalité locale des professionnels" ────────────────
  for (const ds of ['fiscalite-locale-des-entreprises', 'fiscalite-locale-des-entreprises-copie']) {
    try {
      const r = await fetchEconomieDataset(code, ds)
      if (r) {
        const result = { taux: r.taux, nom: r.nom, annee: 2024, source: `DGFiP — data.economie.gouv.fr (${ds})`, fetchedAt: Date.now() }
        cache.set(code, result)
        return NextResponse.json(result)
      }
    } catch (e) { console.error(`[cfe-taux] ${ds} failed:`, e) }
  }

  // ── Source 3 : OFGL REI (format long) ──────────────────────────────────────
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

// ── Source 1 : REI complet DGFiP ─────────────────────────────────────────────
// Dataset large (format REI DGFiP natif) : une ligne par commune, colonnes CFE incluses
async function fetchREIComplet(codeInsee: string): Promise<{ taux: number; nom: string } | null> {
  const DATASET = 'impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir'
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DATASET}/records`

  // Try field name variants × value type variants (string vs numeric in ODS)
  for (const field of ['codgeo', 'code_commune', 'code_insee']) {
    for (const valueExpr of [`"${codeInsee}"`, codeInsee]) {
      try {
        const url = `${base}?where=${encodeURIComponent(`${field}=${valueExpr}`)}&limit=3`
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) continue
        const data = await res.json()
        const results: unknown[] = data.results || data.records || []
        if (!results.length) continue

        const rec = unwrap(results[0])
        console.log(`[cfe-taux] REI complet code=${codeInsee} field=${field} val=${valueExpr} keys:`, Object.keys(rec).slice(0, 30).join(', '))

        const taux = extractCFETaux(rec)
        if (taux !== null && taux > 0) return { taux, nom: extractNom(rec) }
      } catch { continue }
    }
  }
  return null
}

// ── Source 2 : datasets "extrait" data.economie.gouv.fr ───────────────────────
async function fetchEconomieDataset(codeInsee: string, dataset: string): Promise<{ taux: number; nom: string } | null> {
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${dataset}/records`

  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    try {
      const url = `${base}?where=${encodeURIComponent(`${field}="${codeInsee}"`)}&limit=5`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue

      const rec = unwrap(results[0])
      console.log(`[cfe-taux] ${dataset} code=${codeInsee} field=${field} keys:`, Object.keys(rec).slice(0, 30).join(', '))

      const taux = extractCFETaux(rec)
      if (taux !== null && taux > 0) return { taux, nom: extractNom(rec) }
    } catch { continue }
  }
  return null
}

// ── Source 3 : OFGL REI format long ──────────────────────────────────────────
async function fetchOFGL(codeInsee: string): Promise<{ taux: number; nom: string; annee: number } | null> {
  const base = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'

  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    try {
      // Ne filtre PAS sur dispositif_fiscal/categorie côté API — leurs valeurs
      // exactes (casse, accents) ne sont pas vérifiables hors production.
      // On filtre côté code.
      const url = `${base}?where=${encodeURIComponent(`${field}="${codeInsee}"`)}&limit=50&order_by=annee%20desc`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue

      console.log(`[cfe-taux] OFGL code=${codeInsee} field=${field} rows=${results.length} sample:`, JSON.stringify(unwrap(results[0])).slice(0, 200))

      // Filtre côté client : lignes "CFE taux" indépendamment de la casse
      const cfeTaux = results.filter((r) => {
        const rec = unwrap(r)
        const dispositif = String(rec.dispositif_fiscal ?? rec.dispositif ?? '').toLowerCase()
        const categorie  = String(rec.categorie ?? rec.categorie_variable ?? '').toLowerCase()
        return (
          (dispositif.includes('cfe') || dispositif.includes('cotisation fonci')) &&
          categorie.includes('taux')
        )
      })

      if (!cfeTaux.length) {
        // Log les valeurs réelles pour diagnostic
        const sample = results.slice(0, 3).map((r) => {
          const rec = unwrap(r)
          return `[dispositif_fiscal="${rec.dispositif_fiscal}" categorie="${rec.categorie}"]`
        })
        console.warn(`[cfe-taux] OFGL: aucune ligne CFE/taux pour ${codeInsee}. Valeurs trouvées:`, sample.join(', '))
        continue
      }

      // Grouper par année, sommer les taux de tous les destinataires
      const byYear = new Map<number, { total: number; nom: string }>()
      for (const r of cfeTaux) {
        const rec = unwrap(r)
        const annee   = toNum(rec.annee)
        if (!annee) continue
        const montant = toNum(rec.montant ?? rec.valeur ?? rec.taux)
        if (montant === null || montant <= 0) continue
        const nom = String(rec.nom_commune ?? rec.lib_commune ?? rec.libelle_commune ?? rec.nom ?? '')
        const existing = byYear.get(annee)
        if (existing) existing.total += montant
        else           byYear.set(annee, { total: montant, nom })
      }

      if (!byYear.size) continue
      const latestYear = Math.max(...byYear.keys())
      const latest = byYear.get(latestYear)!
      return { taux: Math.round(latest.total * 100) / 100, nom: latest.nom, annee: latestYear }

    } catch { continue }
  }
  return null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function unwrap(r: unknown): Record<string, unknown> {
  if (r && typeof r === 'object') {
    const obj = r as { fields?: Record<string, unknown> }
    return obj.fields ?? (r as Record<string, unknown>)
  }
  return {}
}

function toNum(val: unknown): number | null {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(',', '.'))
    return isNaN(n) ? null : n
  }
  return null
}

function extractCFETaux(fields: Record<string, unknown>): number | null {
  const patterns = [
    'taux_cfe_hz', 'taux_cfe', 'cfe_hz', 'cfe_taux_hz', 'cfe_taux',
    'taux_global_cfe_hz', 'taux_global_cfe', 'txg_cfe_hz', 'txg_cfe',
    'tx_cfe_hz', 'tx_cfe', 'txcfe_hz', 'txcfe',
  ]
  for (const key of patterns) {
    if (key in fields) {
      const n = toNum(fields[key])
      if (n !== null && n > 0) return n
    }
  }
  // Fallback : toute colonne contenant "cfe" avec une valeur de type taux (0–100 %)
  for (const [key, val] of Object.entries(fields)) {
    if (key.toLowerCase().includes('cfe')) {
      const n = toNum(val)
      if (n !== null && n > 0 && n < 100) return n
    }
  }
  return null
}

function extractNom(fields: Record<string, unknown>): string {
  for (const key of ['libgeo', 'nom_commune', 'lib_commune', 'libelle_commune', 'nom', 'commune', 'libelle']) {
    if (key in fields && typeof fields[key] === 'string') return fields[key] as string
  }
  return ''
}
