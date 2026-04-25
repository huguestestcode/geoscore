import { NextRequest, NextResponse } from 'next/server'

const META_API_VERSION = 'v21.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

// Public Meta Ad Library search (no token required)
async function searchPublicAdLibrary(query: string): Promise<Array<{ id: string; name: string }>> {
  const url = `https://www.facebook.com/ads/library/async/search_typeahead/?q=${encodeURIComponent(query)}&session_id=${Date.now()}&country=FR&search_type=page`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'fr-FR,fr;q=0.9',
    },
  })

  if (!res.ok) return []

  const text = await res.text()
  // Facebook prefixes JSON responses with "for (;;);" to prevent JSONP hijacking
  const cleaned = text.replace(/^for\s*\(;;\)\s*;\s*/, '')

  try {
    const data = JSON.parse(cleaned)
    const pages: Array<{ id: string; name: string }> = []

    // Extract from the typeahead payload
    const suggestions = data?.payload?.pageResults || data?.payload?.results || data?.payload || []
    if (Array.isArray(suggestions)) {
      for (const item of suggestions) {
        if (item.page_id && item.page_name) {
          pages.push({ id: String(item.page_id), name: item.page_name })
        } else if (item.id && item.name) {
          pages.push({ id: String(item.id), name: item.name })
        }
      }
    }

    return pages
  } catch {
    return []
  }
}

// Graph API search (requires token)
async function searchGraphAPI(query: string, token: string): Promise<Array<{ id: string; name: string }>> {
  const params = new URLSearchParams({
    access_token: token,
    search_terms: query,
    ad_reached_countries: '["FR"]',
    ad_type: 'ALL',
    fields: 'page_id,page_name',
    limit: '50',
  })

  const res = await fetch(`${META_BASE_URL}/ads_archive?${params}`, {
    next: { revalidate: 600 },
  })

  if (!res.ok) return []

  const data = await res.json()
  const ads: Array<{ page_id: string; page_name: string }> = data.data || []

  const seen = new Map<string, string>()
  for (const ad of ads) {
    if (ad.page_id && !seen.has(ad.page_id)) {
      seen.set(ad.page_id, ad.page_name)
    }
  }

  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ pages: [] })
  }

  const token = process.env.META_ADS_LIBRARY_TOKEN

  try {
    // Try Graph API first if token available, then fallback to public
    let pages: Array<{ id: string; name: string }> = []

    if (token) {
      pages = await searchGraphAPI(query, token)
    }

    if (pages.length === 0) {
      pages = await searchPublicAdLibrary(query)
    }

    return NextResponse.json({ pages })
  } catch {
    return NextResponse.json(
      { error: 'Erreur de connexion a Meta' },
      { status: 502 }
    )
  }
}
