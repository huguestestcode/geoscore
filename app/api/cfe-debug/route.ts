import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint — retourne les réponses brutes de toutes les sources.
 * Usage: GET /api/cfe-debug?code=69123
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || '69123'
  const REI_COMPLET = 'impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir'

  const [reiComplet, extrait, copie, ofglRaw, ofglSample] = await Promise.all([
    probe(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${REI_COMPLET}/records?where=${enc(`codgeo="${code}"`)}&limit=2`),
    probe(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises/records?where=${enc(`codgeo="${code}"`)}&limit=2`),
    probe(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises-copie/records?where=${enc(`codgeo="${code}"`)}&limit=2`),
    probe(`https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?where=${enc(`code_commune="${code}"`)}&limit=10&order_by=annee%20desc`),
    probe(`https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?limit=2`),
  ])

  return NextResponse.json({ code, ts: new Date().toISOString(), reiComplet, extrait, copie, ofglRaw, ofglSample })
}

const enc = encodeURIComponent

async function probe(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const text = await res.text()
    return { url, status: res.status, body: tryJSON(text) }
  } catch (e) {
    return { url, error: String(e) }
  }
}

function tryJSON(t: string): unknown {
  try { return JSON.parse(t) } catch { return t.slice(0, 1000) }
}
