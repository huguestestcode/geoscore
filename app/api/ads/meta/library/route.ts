import { NextRequest, NextResponse } from 'next/server'
import type { MetaAd, Creative } from '@/app/ads-analyzer/types'

const META_API_VERSION = 'v21.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

const META_FIELDS = [
  'id',
  'ad_creation_time',
  'ad_delivery_start_time',
  'ad_delivery_stop_time',
  'ad_creative_bodies',
  'ad_creative_link_titles',
  'ad_creative_link_descriptions',
  'ad_creative_link_captions',
  'ad_snapshot_url',
  'bylines',
  'publisher_platforms',
  'languages',
  'impressions',
  'spend',
  'demographic_distribution',
  'delivery_by_region',
  'estimated_audience_size',
  'page_id',
  'page_name',
].join(',')

function metaAdToCreative(ad: MetaAd): Creative {
  const isActive = !ad.ad_delivery_stop_time
  return {
    id: `meta_${ad.id}`,
    platform: 'meta',
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
    is_active: isActive,
    languages: ad.languages,
    raw_meta: ad,
  }
}

export async function GET(request: NextRequest) {
  const token = process.env.META_ADS_LIBRARY_TOKEN
  if (!token) {
    return NextResponse.json({
      creatives: [],
      error: 'META_ADS_LIBRARY_TOKEN non configure. Ajoutez-le dans .env pour activer la recherche Meta.',
    })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const pageId = searchParams.get('page_id') || ''
  const country = searchParams.get('country') || 'FR'
  const activeOnly = searchParams.get('active_only') !== 'false'
  const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 50)
  const cursor = searchParams.get('cursor') || ''

  // Build Meta Ad Library API params
  const params = new URLSearchParams({
    access_token: token,
    ad_reached_countries: `["${country}"]`,
    ad_type: 'ALL',
    fields: META_FIELDS,
    limit: String(limit),
  })

  if (query) params.set('search_terms', query)
  if (pageId) params.set('search_page_ids', pageId)
  if (activeOnly) params.set('ad_active_status', 'ACTIVE')
  if (cursor) params.set('after', cursor)

  try {
    const res = await fetch(`${META_BASE_URL}/ads_archive?${params}`, {
      next: { revalidate: 300 }, // cache 5 min
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Meta Ad Library error:', err)
      return NextResponse.json(
        { error: 'Erreur Meta Ad Library', details: err?.error?.message },
        { status: res.status }
      )
    }

    const data = await res.json()
    const creatives: Creative[] = (data.data || []).map(metaAdToCreative)
    const nextCursor = data.paging?.cursors?.after

    return NextResponse.json({
      creatives,
      next_cursor: data.paging?.next ? nextCursor : null,
      total: creatives.length,
    })
  } catch (error) {
    console.error('Meta Ad Library fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur de connexion à Meta Ad Library' },
      { status: 502 }
    )
  }
}
