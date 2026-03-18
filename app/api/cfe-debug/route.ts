import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint — returns raw API responses from both data sources.
 * Usage: GET /api/cfe-debug?code=69123
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || '69123'
  const out: Record<string, unknown> = { code, ts: new Date().toISOString() }

  // 1. data.economie.gouv.fr — extrait
  out.economie_extrait = await probe(
    `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises/records?where=${encodeURIComponent(`codgeo="${code}"`)}&limit=3`
  )

  // 2. data.economie.gouv.fr — copie géo
  out.economie_copie = await probe(
    `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises-copie/records?where=${encodeURIComponent(`codgeo="${code}"`)}&limit=3`
  )

  // 3. OFGL REI — no filter, just commune (shows real field values)
  out.ofgl_raw = await probe(
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?where=${encodeURIComponent(`code_commune="${code}"`)}&limit=10&order_by=annee%20desc`
  )

  // 4. OFGL REI — sample 2 records to see field names
  out.ofgl_sample = await probe(
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?limit=2`
  )

  return NextResponse.json(out)
}

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
