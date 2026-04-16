import { NextRequest, NextResponse } from 'next/server'
import type { Creative } from '@/app/ads-analyzer/types'

// ─── Scrape the PUBLIC Meta Ad Library (no token needed) ─────────────────────
const META_AD_LIBRARY_API = 'https://ad-library.facebook.com/api/library/search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const country = searchParams.get('country') || 'FR'
  const activeOnly = searchParams.get('active_only') !== 'false'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const pageId = searchParams.get('page_id') || ''

  if (!query && !pageId) {
    return NextResponse.json({ creatives: [], total: 0 })
  }

  // Try the Graph API if token exists (best quality)
  const token = process.env.META_ADS_LIBRARY_TOKEN
  if (token) {
    return searchWithGraphAPI(token, query, pageId, country, activeOnly, limit)
  }

  // Otherwise use public scraping approach
  return searchPublicLibrary(query, pageId, country, activeOnly, limit)
}

// ─── Graph API (if token available) ──────────────────────────────────────────
async function searchWithGraphAPI(
  token: string,
  query: string,
  pageId: string,
  country: string,
  activeOnly: boolean,
  limit: number
) {
  const fields = [
    'id', 'ad_creation_time', 'ad_delivery_start_time', 'ad_delivery_stop_time',
    'ad_creative_bodies', 'ad_creative_link_titles', 'ad_creative_link_descriptions',
    'ad_creative_link_captions', 'ad_snapshot_url', 'bylines', 'publisher_platforms',
    'languages', 'impressions', 'spend', 'page_id', 'page_name',
  ].join(',')

  const params = new URLSearchParams({
    access_token: token,
    ad_reached_countries: `["${country}"]`,
    ad_type: 'ALL',
    fields,
    limit: String(limit),
  })

  if (query) params.set('search_terms', query)
  if (pageId) params.set('search_page_ids', pageId)
  if (activeOnly) params.set('ad_active_status', 'ACTIVE')

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/ads_archive?${params}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return NextResponse.json({ creatives: [], total: 0 })

    const data = await res.json()
    const creatives: Creative[] = (data.data || []).map((ad: any) => ({
      id: `meta_${ad.id}`,
      platform: 'meta' as const,
      brand_name: ad.page_name || ad.bylines?.[0] || 'Inconnu',
      brand_id: ad.page_id,
      headline: ad.ad_creative_link_titles?.[0],
      body_text: ad.ad_creative_bodies?.[0],
      cta: ad.ad_creative_link_captions?.[0],
      media_url: ad.ad_snapshot_url,
      impressions_lower: ad.impressions ? parseInt(ad.impressions.lower_bound) : undefined,
      impressions_upper: ad.impressions ? parseInt(ad.impressions.upper_bound) : undefined,
      spend_lower: ad.spend ? parseInt(ad.spend.lower_bound) : undefined,
      spend_upper: ad.spend ? parseInt(ad.spend.upper_bound) : undefined,
      start_date: ad.ad_delivery_start_time || ad.ad_creation_time,
      end_date: ad.ad_delivery_stop_time,
      is_active: !ad.ad_delivery_stop_time,
      languages: ad.languages,
    }))

    return NextResponse.json({ creatives, total: creatives.length })
  } catch {
    return NextResponse.json({ creatives: [], total: 0 })
  }
}

// ─── Public Ad Library scraping (no token) ───────────────────────────────────
async function searchPublicLibrary(
  query: string,
  pageId: string,
  country: string,
  activeOnly: boolean,
  limit: number
) {
  try {
    // Use the public facebook ad library search page
    const params = new URLSearchParams({
      q: query || '',
      country: country,
      ...(activeOnly ? { active_status: 'active' } : {}),
      ad_type: 'all',
      media_type: 'all',
      search_type: 'keyword_unordered',
    })

    const url = `https://www.facebook.com/ads/library/?${params}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    })

    if (!res.ok) {
      return NextResponse.json({
        creatives: [],
        total: 0,
        info: 'La recherche Meta Ad Library publique est limitee. Pour de meilleurs resultats, ajoutez META_ADS_LIBRARY_TOKEN dans .env (gratuit sur developers.facebook.com).',
      })
    }

    const html = await res.text()
    const creatives = extractCreativesFromHTML(html, limit)

    return NextResponse.json({
      creatives,
      total: creatives.length,
      info: creatives.length === 0
        ? 'Meta Ad Library publique: aucun resultat. Ajoutez un META_ADS_LIBRARY_TOKEN (gratuit) pour de meilleurs resultats.'
        : undefined,
    })
  } catch {
    return NextResponse.json({
      creatives: [],
      total: 0,
      info: 'Meta Ad Library inaccessible. Ajoutez META_ADS_LIBRARY_TOKEN dans .env pour activer la recherche Meta.',
    })
  }
}

// Extract ad data embedded in the HTML page
function extractCreativesFromHTML(html: string, limit: number): Creative[] {
  const creatives: Creative[] = []

  // Facebook embeds ad data in JSON within the HTML
  // Look for patterns like {"page_name":"...","ad_creative_bodies":["..."]}
  const jsonMatches = html.match(/\{"__typename":"AdLibrarySearchResult".*?\}/g) || []

  for (const match of jsonMatches.slice(0, limit)) {
    try {
      const data = JSON.parse(match)
      creatives.push({
        id: `meta_pub_${data.ad_id || Date.now()}_${creatives.length}`,
        platform: 'meta',
        brand_name: data.page_name || 'Inconnu',
        brand_id: data.page_id,
        headline: data.link_title,
        body_text: data.body_text || data.ad_creative_bodies?.[0],
        media_url: data.snapshot_url || data.image_url,
        start_date: data.start_date || new Date().toISOString(),
        is_active: data.is_active !== false,
      })
    } catch {
      continue
    }
  }

  return creatives
}
