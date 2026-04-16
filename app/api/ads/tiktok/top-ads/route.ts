import { NextRequest, NextResponse } from 'next/server'
import type { TikTokAd, Creative } from '@/app/ads-analyzer/types'

const TIKTOK_CREATIVE_CENTER_URL =
  'https://ads.tiktok.com/creative_radar_api/v1/top_ads/list'

// Valid country codes for TikTok Creative Center
const VALID_TIKTOK_COUNTRIES = new Set([
  'FR', 'US', 'GB', 'DE', 'ES', 'IT', 'BR', 'CA', 'AU', 'NL',
  'BE', 'CH', 'PT', 'JP', 'KR', 'ID', 'TH', 'VN', 'MY', 'PH',
  'SG', 'TW', 'MX', 'AR', 'CO', 'CL', 'PL', 'SE', 'NO', 'DK',
  'FI', 'AT', 'IE', 'CZ', 'RO', 'HU', 'GR', 'TR', 'SA', 'AE',
  'EG', 'ZA', 'NG', 'KE', 'IL', 'UA', 'RU', 'IN',
])

function tiktokAdToCreative(ad: TikTokAd): Creative {
  return {
    id: `tiktok_${ad.id}`,
    platform: 'tiktok',
    brand_name: ad.brand_name || 'Inconnu',
    headline: ad.ad_title,
    media_url: ad.video_info?.cover,
    video_url: ad.video_info?.video_url,
    likes: ad.like_cnt,
    comments: ad.comment_cnt,
    shares: ad.share_cnt,
    views: ad.view_cnt,
    ctr: ad.ctr,
    landing_page_url: ad.landing_page_url,
    start_date: new Date().toISOString(),
    is_active: true,
    tags: ad.tag_list,
    country: ad.country_code,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const period = searchParams.get('period') || '30'
  const rawCountry = searchParams.get('country') || 'FR'
  const country = VALID_TIKTOK_COUNTRIES.has(rawCountry) ? rawCountry : 'FR'
  const industry = searchParams.get('industry') || ''
  const sortBy = searchParams.get('sort_by') || 'like'
  const page = searchParams.get('page') || '1'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const keyword = searchParams.get('q') || ''

  const params: Record<string, string> = {
    period,
    country_code: country,
    sort_by: sortBy,
    page,
    limit: String(limit),
  }

  if (industry) params.industry_id = industry
  if (keyword) params.keyword = keyword

  const queryString = new URLSearchParams(params).toString()

  try {
    const res = await fetch(`${TIKTOK_CREATIVE_CENTER_URL}?${queryString}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Referer': 'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en',
      },
      next: { revalidate: 600 },
    })

    if (!res.ok) {
      console.error('TikTok API HTTP error:', res.status, res.statusText)
      return NextResponse.json(
        { error: `TikTok API erreur HTTP ${res.status}`, creatives: [] },
        { status: res.status }
      )
    }

    const data = await res.json()

    if (data.code !== 0) {
      console.error('TikTok API error:', data.code, data.msg)
      return NextResponse.json(
        { error: `TikTok API: ${data.msg}`, creatives: [] },
        { status: 400 }
      )
    }

    const materials: TikTokAd[] = data.data?.materials || []
    const creatives: Creative[] = materials.map(tiktokAdToCreative)
    const pagination = data.data?.pagination

    return NextResponse.json({
      creatives,
      pagination: {
        page: pagination?.page || 1,
        total_pages: pagination?.total_page || 1,
        total_count: pagination?.total_count || 0,
      },
    })
  } catch (error) {
    console.error('TikTok Creative Center error:', error)
    return NextResponse.json(
      { error: 'Erreur de connexion a TikTok Creative Center', creatives: [] },
      { status: 502 }
    )
  }
}
