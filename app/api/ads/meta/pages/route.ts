import { NextRequest, NextResponse } from 'next/server'

const META_API_VERSION = 'v21.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export async function GET(request: NextRequest) {
  const token = process.env.META_ADS_LIBRARY_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'META_ADS_LIBRARY_TOKEN non configure' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ pages: [] })
  }

  const params = new URLSearchParams({
    access_token: token,
    search_terms: query,
    ad_reached_countries: '["FR"]',
    ad_type: 'ALL',
    fields: 'page_id,page_name',
    limit: '50',
  })

  try {
    const res = await fetch(`${META_BASE_URL}/ads_archive?${params}`, {
      next: { revalidate: 600 },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: 'Erreur Meta API', details: err?.error?.message },
        { status: res.status }
      )
    }

    const data = await res.json()
    const ads: Array<{ page_id: string; page_name: string }> = data.data || []

    // Deduplicate by page_id
    const seen = new Map<string, string>()
    for (const ad of ads) {
      if (ad.page_id && !seen.has(ad.page_id)) {
        seen.set(ad.page_id, ad.page_name)
      }
    }

    const pages = Array.from(seen.entries()).map(([id, name]) => ({
      id,
      name,
    }))

    return NextResponse.json({ pages })
  } catch {
    return NextResponse.json(
      { error: 'Erreur de connexion a Meta' },
      { status: 502 }
    )
  }
}
