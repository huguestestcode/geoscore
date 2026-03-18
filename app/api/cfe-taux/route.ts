import { NextRequest, NextResponse } from 'next/server'

// Cache taux in memory (same values for the entire year)
const cache = new Map<string, { taux: number; nom: string; annee: number; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24h

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide (5 chiffres attendus)' }, { status: 400 })
  }

  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // ── Source 1: data.economie.gouv.fr ───────────────────────────────────────
  for (const dataset of [
    'fiscalite-locale-des-entreprises',
    'fiscalite-locale-des-entreprises-copie',
  ]) {
    try {
      const taux = await fetchFromEconomie(code, dataset)
      if (taux) {
        const result = { taux: taux.taux, nom: taux.nom, annee: 2024, source: 'DGFiP — data.economie.gouv.fr', fetchedAt: Date.now() }
        cache.set(code, result)
        return NextResponse.json(result)
      }
    } catch (e) {
      console.error(`[cfe-taux] economie ${dataset} failed:`, e)
    }
  }

  // ── Source 2: data.ofgl.fr — REI ──────────────────────────────────────────
  try {
    const taux = await fetchFromOFGL(code)
    if (taux) {
      const result = { taux: taux.taux, nom: taux.nom, annee: taux.annee, source: 'OFGL — data.ofgl.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) {
    console.error('[cfe-taux] ofgl failed:', e)
  }

  return NextResponse.json(
    { error: `Taux CFE non trouvé pour le code INSEE ${code}.` },
    { status: 404 }
  )
}

// ── data.economie.gouv.fr ─────────────────────────────────────────────────────
async function fetchFromEconomie(
  codeInsee: string,
  dataset: string,
): Promise<{ taux: number; nom: string } | null> {
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${dataset}/records`

  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    try {
      const url = `${base}?where=${encodeURIComponent(`${field}="${codeInsee}"`)}&limit=5`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue

      const data = await res.json()
      const results: Record<string, unknown>[] = data.results || data.records || []
      if (results.length === 0) continue

      // ODS v2.1 returns flat records (no nested .fields)
      const rec = (results[0] as { fields?: Record<string, unknown> }).fields ?? results[0] as Record<string, unknown>
      console.log(`[cfe-taux] economie/${dataset} code=${codeInsee} field=${field} keys:`, Object.keys(rec).join(', '))

      const taux = extractCFETaux(rec)
      if (taux !== null && taux > 0) {
        return { taux, nom: extractNom(rec) }
      }
    } catch {
      continue
    }
  }
  return null
}

// ── data.ofgl.fr — REI ────────────────────────────────────────────────────────
async function fetchFromOFGL(
  codeInsee: string,
): Promise<{ taux: number; nom: string; annee: number } | null> {
  const base = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'

  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    try {
      // Query only by commune code — no dispositif_fiscal/categorie filter
      // because their exact values (case, accents) vary and can't be verified offline.
      // We filter client-side instead.
      const url = `${base}?where=${encodeURIComponent(`${field}="${codeInsee}"`)}&limit=50&order_by=annee%20desc`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue

      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (results.length === 0) continue

      console.log(`[cfe-taux] OFGL code=${codeInsee} field=${field} got ${results.length} rows, sample:`, JSON.stringify(results[0]))

      // Client-side filter: keep rows that look like "CFE taux" regardless of casing
      const cfeTauxRows = results.filter((r) => {
        const rec = unwrap(r)
        const dispositif = String(rec.dispositif_fiscal ?? rec.dispositif ?? '').toLowerCase()
        const categorie  = String(rec.categorie ?? rec.categorie_variable ?? '').toLowerCase()
        return (
          (dispositif.includes('cfe') || dispositif.includes('cotisation fonci')) &&
          categorie.includes('taux')
        )
      })

      if (cfeTauxRows.length === 0) {
        // Log what we got so we can diagnose the actual field values
        console.warn(`[cfe-taux] OFGL: no CFE taux rows for ${codeInsee}, sample dispositifs:`,
          results.slice(0, 3).map((r) => {
            const rec = unwrap(r)
            return `dispositif_fiscal=${rec.dispositif_fiscal}, categorie=${rec.categorie}`
          }).join(' | ')
        )
        continue
      }

      // Group by year, sum taux across all destinataires
      const byYear = new Map<number, { total: number; nom: string }>()
      for (const r of cfeTauxRows) {
        const rec = unwrap(r)
        const annee   = toNumber(rec.annee)
        if (!annee) continue
        const montant = toNumber(rec.montant ?? rec.valeur ?? rec.taux)
        if (montant === null || montant <= 0) continue
        const nom = String(rec.nom_commune ?? rec.lib_commune ?? rec.libelle_commune ?? rec.nom ?? '')
        const existing = byYear.get(annee)
        if (existing) { existing.total += montant }
        else           { byYear.set(annee, { total: montant, nom }) }
      }

      if (byYear.size === 0) continue

      const latestYear = Math.max(...byYear.keys())
      const latest = byYear.get(latestYear)!
      return { taux: Math.round(latest.total * 100) / 100, nom: latest.nom, annee: latestYear }

    } catch {
      continue
    }
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

function toNumber(val: unknown): number | null {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(',', '.'))
    return isNaN(n) ? null : n
  }
  return null
}

function extractCFETaux(fields: Record<string, unknown>): number | null {
  // Known field name patterns (lowercased)
  const patterns = [
    'taux_cfe_hz', 'taux_cfe', 'cfe_hz', 'cfe_taux_hz', 'cfe_taux',
    'taux_global_cfe_hz', 'taux_global_cfe', 'txg_cfe_hz', 'txg_cfe',
    'tx_cfe_hz', 'tx_cfe', 'txcfe_hz', 'txcfe',
  ]
  for (const key of patterns) {
    if (key in fields) {
      const n = toNumber(fields[key])
      if (n !== null && n > 0) return n
    }
  }
  // Fallback: any field with "cfe" in the name that looks like a percentage
  for (const [key, val] of Object.entries(fields)) {
    if (key.toLowerCase().includes('cfe')) {
      const n = toNumber(val)
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
