import { NextRequest, NextResponse } from 'next/server'

// Cache taux in memory (same values for the entire year)
const cache = new Map<string, { taux: number; nom: string; annee: number; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24h

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide (5 chiffres attendus)' }, { status: 400 })
  }

  // Check cache
  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // ── Source 1: data.economie.gouv.fr — fiscalite-locale-des-entreprises ──
  // This dataset has GLOBAL CFE taux (commune + EPCI + syndicats combined)
  try {
    const taux = await fetchFromEconomie(code)
    if (taux) {
      const result = { taux: taux.taux, nom: taux.nom, annee: 2024, source: 'DGFiP — data.economie.gouv.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) {
    console.error('[cfe-taux] data.economie.gouv.fr failed:', e)
  }

  // ── Source 2: data.ofgl.fr — REI (Recensement des Éléments d'Imposition) ──
  try {
    const taux = await fetchFromOFGL(code)
    if (taux) {
      const result = { taux: taux.taux, nom: taux.nom, annee: taux.annee, source: 'OFGL — data.ofgl.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) {
    console.error('[cfe-taux] data.ofgl.fr failed:', e)
  }

  return NextResponse.json(
    { error: `Taux CFE non trouvé pour le code INSEE ${code}. La commune n'est peut-être pas dans la base.` },
    { status: 404 }
  )
}

// ── data.economie.gouv.fr ─────────────────────────────────────────────────────
async function fetchFromEconomie(codeInsee: string): Promise<{ taux: number; nom: string } | null> {
  const baseUrl = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises/records'

  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    let url: string
    try {
      url = `${baseUrl}?where=${encodeURIComponent(`${field}="${codeInsee}"`)}&limit=5`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue

      const data = await res.json()
      const results = data.results || data.records || []
      if (results.length === 0) continue

      const record = results[0]
      // In ODS v2.1 the payload is flat (no nested .fields)
      const fields = record.fields ?? record
      console.log(`[cfe-taux] economie field=${field} keys:`, Object.keys(fields).join(', '))

      const taux = extractCFETaux(fields)
      const nom = extractNom(fields)

      if (taux !== null && taux > 0) {
        return { taux, nom }
      }
    } catch {
      continue
    }
  }

  return null
}

// ── data.ofgl.fr ──────────────────────────────────────────────────────────────
async function fetchFromOFGL(codeInsee: string): Promise<{ taux: number; nom: string; annee: number } | null> {
  const baseUrl = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'

  // Try both field name variants for the commune code
  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    let url: string
    try {
      // No year filter — get all available years then pick the most recent
      // (avoids issues with annee type: int vs string in the API)
      const where = `${field}="${codeInsee}" AND dispositif_fiscal="CFE" AND categorie="taux"`
      url = `${baseUrl}?where=${encodeURIComponent(where)}&select=montant,valeur,taux,destinataire,nom_commune,lib_commune,libelle_commune,annee&order_by=annee%20desc&limit=30`

      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue

      const data = await res.json()
      const results = data.results || data.records || []
      if (results.length === 0) continue

      console.log(`[cfe-taux] OFGL field=${field} got ${results.length} rows, sample:`, JSON.stringify(results[0]))

      // Group by year (most recent first — already ordered by annee desc)
      // Sum taux across all destinataires for the same year
      const byYear = new Map<number, { total: number; nom: string }>()
      for (const r of results) {
        const rec = r.fields ?? r
        const annee = toNumber(rec.annee)
        if (!annee) continue

        // The taux value can be in different fields depending on dataset version
        const montant = toNumber(rec.montant ?? rec.valeur ?? rec.taux)
        if (montant === null || montant <= 0) continue

        const nom = rec.nom_commune || rec.lib_commune || rec.libelle_commune || rec.nom || ''
        const existing = byYear.get(annee)
        if (existing) {
          existing.total += montant
        } else {
          byYear.set(annee, { total: montant, nom })
        }
      }

      if (byYear.size === 0) continue

      // Pick the most recent year
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

/** Parse a value to number, handling both number and string types */
function toNumber(val: unknown): number | null {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(',', '.'))
    return isNaN(n) ? null : n
  }
  return null
}

function extractCFETaux(fields: Record<string, unknown>): number | null {
  // Try common field name patterns for CFE taux HZ (hors zone)
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

  // Fallback: look for any field containing 'cfe' and a numeric value in [0, 100]
  for (const [key, val] of Object.entries(fields)) {
    if (key.toLowerCase().includes('cfe')) {
      const n = toNumber(val)
      if (n !== null && n > 0 && n < 100) return n
    }
  }

  return null
}

function extractNom(fields: Record<string, unknown>): string {
  for (const key of ['libgeo', 'nom_commune', 'lib_commune', 'libelle_commune', 'nom', 'commune']) {
    if (key in fields && typeof fields[key] === 'string') {
      return fields[key] as string
    }
  }
  return ''
}
