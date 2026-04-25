import { NextRequest, NextResponse } from 'next/server'
import type { Creative } from '@/app/ads-analyzer/types'

// ─── Facebook Ad Library internal API (same as the website uses) ─────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const country = searchParams.get('country') || 'FR'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

  if (!query) {
    return NextResponse.json({ creatives: [], total: 0 })
  }

  // Try Graph API first if token available
  const token = process.env.META_ADS_LIBRARY_TOKEN
  if (token) {
    const creatives = await fetchWithGraphAPI(token, query, country, limit)
    if (creatives.length > 0) {
      return NextResponse.json({ creatives, total: creatives.length })
    }
  }

  // Fallback: scrape the public Ad Library page
  const creatives = await scrapeAdLibrary(query, country, limit)
  return NextResponse.json({ creatives, total: creatives.length })
}

// ─── Graph API (best, needs free token) ──────────────────────────────────────
async function fetchWithGraphAPI(token: string, query: string, country: string, limit: number): Promise<Creative[]> {
  const fields = [
    'id', 'ad_creation_time', 'ad_delivery_start_time', 'ad_delivery_stop_time',
    'ad_creative_bodies', 'ad_creative_link_titles', 'ad_creative_link_descriptions',
    'ad_creative_link_captions', 'ad_snapshot_url', 'bylines',
    'languages', 'impressions', 'spend', 'page_id', 'page_name',
  ].join(',')

  const params = new URLSearchParams({
    access_token: token,
    ad_reached_countries: `["${country}"]`,
    ad_type: 'ALL',
    fields,
    limit: String(limit),
    search_terms: query,
    ad_active_status: 'ACTIVE',
  })

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/ads_archive?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []).map((ad: any) => ({
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
      landing_page_url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(ad.page_name || query)}`,
    }))
  } catch {
    return []
  }
}

// ─── Scrape public Ad Library HTML ───────────────────────────────────────────
async function scrapeAdLibrary(query: string, country: string, limit: number): Promise<Creative[]> {
  try {
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(query)}&media_type=all`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
      },
    })

    if (!res.ok) return []

    const html = await res.text()
    const creatives: Creative[] = []

    // Facebook embeds structured data in the HTML as JSON-LD or in require() calls
    // Extract ad data from the server-rendered HTML

    // Pattern 1: Look for ad data in adCards/search results JSON blobs
    const jsonRegex = /"adArchiveID":"(\d+)".*?"pageName":"([^"]*)".*?"startDate":(\d+).*?"snapshot":\{[^}]*"body":\{[^}]*"markup":\{[^}]*"__html":"([^"]*)"/g
    let match
    while ((match = jsonRegex.exec(html)) !== null && creatives.length < limit) {
      creatives.push({
        id: `meta_${match[1]}`,
        platform: 'meta',
        brand_name: decodeUnicode(match[2]),
        body_text: decodeHtml(decodeUnicode(match[4])),
        media_url: '',
        start_date: new Date(parseInt(match[3]) * 1000).toISOString(),
        is_active: true,
        landing_page_url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(query)}`,
      })
    }

    // Pattern 2: Simpler - extract page names and ad bodies from escaped JSON
    if (creatives.length === 0) {
      const pageNameRegex = /"page_name\\?":\\?"([^"\\]+)/g
      const bodyRegex = /"ad_creative_bodies\\?":\[\\?"([^"\\]+)/g
      const snapshotRegex = /"ad_snapshot_url\\?":\\?"([^"\\]+)/g

      const pageNames: string[] = []
      const bodies: string[] = []
      const snapshots: string[] = []

      let m
      while ((m = pageNameRegex.exec(html)) !== null) pageNames.push(decodeUnicode(m[1]))
      while ((m = bodyRegex.exec(html)) !== null) bodies.push(decodeUnicode(m[1]))
      while ((m = snapshotRegex.exec(html)) !== null) snapshots.push(decodeUnicode(m[1]))

      const count = Math.min(pageNames.length, limit)
      for (let i = 0; i < count; i++) {
        creatives.push({
          id: `meta_scraped_${i}_${Date.now()}`,
          platform: 'meta',
          brand_name: pageNames[i] || query,
          body_text: bodies[i] || undefined,
          media_url: snapshots[i] || '',
          start_date: new Date().toISOString(),
          is_active: true,
          landing_page_url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(pageNames[i] || query)}`,
        })
      }
    }

    return creatives
  } catch (e) {
    console.error('Meta scrape error:', e)
    return []
  }
}

function decodeUnicode(str: string): string {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, (m) =>
    String.fromCharCode(parseInt(m.replace('\\u', ''), 16))
  )
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]*>/g, '')
}
