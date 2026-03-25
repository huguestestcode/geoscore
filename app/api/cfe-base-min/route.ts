import { NextRequest, NextResponse } from 'next/server'
import { BASE_MINIMALE_CONNUES } from '../cfe-taux/taux-data'

// ── Cache ──────────────────────────────────────────────────────────────────────
const cache = new Map<string, { base: number | null; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

/**
 * GET /api/cfe-base-min?code=75056
 * Retourne la base minimum CFE votée par la commune (art. 1647 D CGI — délibération TFB-CFE-14).
 * Résultat : { base: number | null, source: string }
 *   - base: montant en € de la base minimum votée, ou null si non trouvée
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide' }, { status: 400 })
  }

  // 1. Cache
  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // 2. Données hardcodées
  const known = BASE_MINIMALE_CONNUES[code]
  if (known) {
    const result = {
      base: known.base,
      source: known.source,
      caMax: known.caMax,
      tranches: known.tranches,
      fetchedAt: Date.now(),
    }
    cache.set(code, result)
    return NextResponse.json(result)
  }

  // 3. Dataset délibérations communes 2025 — DGFiP (code TFB-CFE-14 = base min CFE art.1647D)
  try {
    const r = await fetchDeliberationsCommune(code)
    if (r !== null) {
      const result = { base: r, source: 'DGFiP délibérations communes 2025', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-base-min] délibérations communes failed:', e) }

  // 4. Dataset délibérations GFP 2025 (pour EPCI à fiscalité professionnelle unique)
  try {
    const r = await fetchDeliberationsGFP(code)
    if (r !== null) {
      const result = { base: r, source: 'DGFiP délibérations GFP 2025', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-base-min] délibérations GFP failed:', e) }

  // 5. REI complet — cherche base minimum dans les données agrégées
  try {
    const r = await fetchREIBaseMin(code)
    if (r !== null) {
      const result = { base: r, source: 'DGFiP REI', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-base-min] REI failed:', e) }

  // Non trouvée
  const result = { base: null, source: 'non disponible', fetchedAt: Date.now() }
  cache.set(code, result)
  return NextResponse.json(result)
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

async function fetchDeliberationsCommune(code: string): Promise<number | null> {
  const DS = 'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux'
  const apiUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DS}/records`

  // TFB-CFE-14 = délibération base minimum CFE (art. 1647 D CGI)
  for (const codeField of ['codgeo', 'code_commune', 'code_insee']) {
    for (const delibField of ['code_dispositif', 'code_deliberation', 'code_delibration']) {
      try {
        const where = `${codeField}="${code}" AND ${delibField}="TFB-CFE-14"`
        const url = `${apiUrl}?where=${encodeURIComponent(where)}&limit=10`
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) continue
        const data = await res.json()
        const results: unknown[] = data.results || data.records || []
        if (!results.length) continue
        console.log(`[cfe-base-min] délibérations communes hit: field=${codeField} delibField=${delibField}`)
        const amt = extractBaseMin(results)
        if (amt !== null) return amt
      } catch { continue }
    }
  }
  return null
}

async function fetchDeliberationsGFP(code: string): Promise<number | null> {
  // Pour les EPCI à FPU, la base minimum est souvent fixée au niveau intercommunal
  const DS = 'deliberations-de-fiscalite-directe-locale-des-groupements-a-fiscalite-propre-2025-hors-taux'
  const apiUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DS}/records`

  for (const codeField of ['codgeo_commune', 'code_commune', 'codgeo']) {
    for (const delibField of ['code_dispositif', 'code_deliberation']) {
      try {
        const where = `${codeField}="${code}" AND ${delibField}="TFB-CFE-14"`
        const url = `${apiUrl}?where=${encodeURIComponent(where)}&limit=10`
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) continue
        const data = await res.json()
        const results: unknown[] = data.results || data.records || []
        if (!results.length) continue
        console.log(`[cfe-base-min] délibérations GFP hit: codeField=${codeField}`)
        const amt = extractBaseMin(results)
        if (amt !== null) return amt
      } catch { continue }
    }
  }
  return null
}

async function fetchREIBaseMin(code: string): Promise<number | null> {
  const DS = 'impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir'
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DS}/records`

  for (const field of ['codgeo', 'code_commune', 'code_insee']) {
    try {
      const url = `${base}?where=${encodeURIComponent(`${field}="${code}"`)}&limit=3`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue
      const rec = unwrap(results[0])
      // Cherche les champs base minimum dans le REI
      for (const k of ['bmin_cfe', 'base_min_cfe', 'base_minimum_cfe', 'cotmin_cfe', 'bmin', 'base_min']) {
        if (k in rec) {
          const n = toNum(rec[k])
          if (n && n > 0 && n < 10000) return n
        }
      }
      // Cherche dynamiquement
      for (const [k, v] of Object.entries(rec)) {
        if ((k.includes('bmin') || k.includes('base_min')) && k.includes('cfe')) {
          const n = toNum(v); if (n && n > 0 && n < 10000) return n
        }
      }
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

/**
 * Extrait le montant de la base minimale depuis les résultats de délibérations.
 * Les résultats peuvent contenir des montants par tranche de CA.
 * On retourne le montant le plus bas (tranche de CA la plus petite = plus représentative des micro-entreprises).
 */
function extractBaseMin(results: unknown[]): number | null {
  const amounts: number[] = []
  for (const r of results) {
    const rec = unwrap(r)
    // Champs typiques dans les datasets délibérations DGFiP
    for (const k of [
      'montant_delibere', 'montant', 'valeur', 'base_minimum', 'base_min',
      'montant_base_min', 'valeur_deliberee', 'montant_vote',
    ]) {
      if (k in rec) {
        const n = toNum(rec[k])
        if (n && n >= 100 && n <= 10000) amounts.push(n)
      }
    }
    // Recherche par pattern dans les clés
    for (const [k, v] of Object.entries(rec)) {
      if (k.includes('montant') || k.includes('valeur') || k.includes('base')) {
        const n = toNum(v)
        if (n && n >= 100 && n <= 10000) amounts.push(n)
      }
    }
  }
  if (!amounts.length) return null
  // Retourne le montant le plus bas (tranche la plus basse = micro-entrepreneurs)
  return Math.min(...amounts)
}
