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
      const result = { taux: taux.taux, nom: taux.nom, annee: 2024, source: 'OFGL — data.ofgl.fr', fetchedAt: Date.now() }
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
  // The dataset "fiscalite-locale-des-entreprises" has global CFE taux
  // Try multiple possible field names for commune code
  const baseUrl = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises/records'

  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    const url = `${baseUrl}?where=${field}="${codeInsee}"&limit=5`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) continue

    const data = await res.json()
    const results = data.results || data.records || []
    if (results.length === 0) continue

    // Find the CFE taux — look for field containing "cfe" and "hz" (hors zone)
    const record = results[0]
    const fields = record.fields || record
    const taux = extractCFETaux(fields)
    const nom = extractNom(fields)

    if (taux !== null && taux > 0) {
      return { taux, nom }
    }
  }

  return null
}

// ── data.ofgl.fr ──────────────────────────────────────────────────────────────
async function fetchFromOFGL(codeInsee: string): Promise<{ taux: number; nom: string } | null> {
  // REI dataset — long format: dispositif_fiscal="CFE", categorie="taux"
  // Need to sum taux across destinataires (commune + EPCI + syndicats) for global taux
  const baseUrl = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'

  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    const where = `${field}="${codeInsee}" AND dispositif_fiscal="CFE" AND categorie="taux" AND annee="2024"`
    const url = `${baseUrl}?where=${encodeURIComponent(where)}&select=montant,destinataire,nom_commune,lib_commune&limit=20`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) continue

    const data = await res.json()
    const results = data.results || data.records || []
    if (results.length === 0) continue

    // Sum all destinataires to get the global taux
    let totalTaux = 0
    let nom = ''
    for (const r of results) {
      const fields = r.fields || r
      const montant = fields.montant ?? fields.valeur ?? 0
      if (typeof montant === 'number' && montant > 0) {
        totalTaux += montant
      }
      if (!nom) {
        nom = fields.nom_commune || fields.lib_commune || fields.nom || ''
      }
    }

    if (totalTaux > 0) {
      return { taux: Math.round(totalTaux * 100) / 100, nom }
    }
  }

  return null
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractCFETaux(fields: Record<string, unknown>): number | null {
  // Try common field name patterns for CFE taux HZ (hors zone)
  const patterns = [
    'taux_cfe_hz', 'taux_cfe', 'cfe_hz', 'cfe_taux_hz', 'cfe_taux',
    'taux_global_cfe_hz', 'taux_global_cfe', 'txg_cfe_hz', 'txg_cfe',
    'tx_cfe_hz', 'tx_cfe',
  ]
  for (const key of patterns) {
    if (key in fields && typeof fields[key] === 'number' && (fields[key] as number) > 0) {
      return fields[key] as number
    }
  }

  // Fallback: look for any field containing 'cfe' and a numeric value
  for (const [key, val] of Object.entries(fields)) {
    if (key.toLowerCase().includes('cfe') && typeof val === 'number' && val > 0 && val < 100) {
      return val
    }
  }

  return null
}

function extractNom(fields: Record<string, unknown>): string {
  for (const key of ['libgeo', 'nom_commune', 'lib_commune', 'nom', 'commune']) {
    if (key in fields && typeof fields[key] === 'string') {
      return fields[key] as string
    }
  }
  return ''
}
