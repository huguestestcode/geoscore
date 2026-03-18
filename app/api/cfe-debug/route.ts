import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint — returns raw API responses from both data sources.
 * Usage: GET /api/cfe-debug?code=69123
 *
 * Remove this file once the field names are confirmed.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || '69123'
  const result: Record<string, unknown> = { code, timestamp: new Date().toISOString() }

  // ── Test 1: data.economie.gouv.fr ──────────────────────────────────────────
  const econUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/fiscalite-locale-des-entreprises/records?where=${encodeURIComponent(`codgeo="${code}"`)}&limit=3`
  try {
    const res = await fetch(econUrl, { signal: AbortSignal.timeout(10000) })
    const body = await res.text()
    result.economie = {
      url: econUrl,
      status: res.status,
      body: tryParse(body),
    }
  } catch (e) {
    result.economie = { url: econUrl, error: String(e) }
  }

  // ── Test 2: data.ofgl.fr — with filters ────────────────────────────────────
  const ofglUrl = `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?where=${encodeURIComponent(`code_commune="${code}" AND dispositif_fiscal="CFE" AND categorie="taux"`)}&limit=10`
  try {
    const res = await fetch(ofglUrl, { signal: AbortSignal.timeout(10000) })
    const body = await res.text()
    result.ofgl_filtered = {
      url: ofglUrl,
      status: res.status,
      body: tryParse(body),
    }
  } catch (e) {
    result.ofgl_filtered = { url: ofglUrl, error: String(e) }
  }

  // ── Test 3: data.ofgl.fr — no filter, just commune ─────────────────────────
  const ofglRawUrl = `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?where=${encodeURIComponent(`code_commune="${code}"`)}&limit=5`
  try {
    const res = await fetch(ofglRawUrl, { signal: AbortSignal.timeout(10000) })
    const body = await res.text()
    result.ofgl_raw = {
      url: ofglRawUrl,
      status: res.status,
      body: tryParse(body),
    }
  } catch (e) {
    result.ofgl_raw = { url: ofglRawUrl, error: String(e) }
  }

  // ── Test 4: data.ofgl.fr — first record of dataset (no filter) ─────────────
  const ofglSampleUrl = `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records?limit=2`
  try {
    const res = await fetch(ofglSampleUrl, { signal: AbortSignal.timeout(10000) })
    const body = await res.text()
    result.ofgl_sample = {
      url: ofglSampleUrl,
      status: res.status,
      body: tryParse(body),
    }
  } catch (e) {
    result.ofgl_sample = { url: ofglSampleUrl, error: String(e) }
  }

  return NextResponse.json(result, { status: 200 })
}

function tryParse(text: string): unknown {
  try { return JSON.parse(text) } catch { return text.slice(0, 500) }
}
