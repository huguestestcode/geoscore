import { NextRequest, NextResponse } from 'next/server'
import type { TikTokAd, Creative } from '@/app/ads-analyzer/types'

const TIKTOK_CREATIVE_CENTER_URL =
  'https://ads.tiktok.com/creative_radar_api/v1/top_ads/list'

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
    start_date: new Date().toISOString(), // TikTok top ads don't expose exact start date
    is_active: true,
    tags: ad.tag_list,
    country: ad.country_code,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const period = searchParams.get('period') || '30'
  const country = searchParams.get('country') || 'FR'
  const industry = searchParams.get('industry') || ''
  const sortBy = searchParams.get('sort_by') || 'like' // like, ctr, impression, cost
  const page = searchParams.get('page') || '1'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const keyword = searchParams.get('q') || ''

  const params: Record<string, string> = {
    period,
    country_code: country,
    sort_by: sortBy,
    page: page,
    limit: String(limit),
  }

  if (industry) params.industry_id = industry
  if (keyword) params.keyword = keyword

  const queryString = new URLSearchParams(params).toString()

  try {
    const res = await fetch(`${TIKTOK_CREATIVE_CENTER_URL}?${queryString}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 600 }, // cache 10 min
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Erreur TikTok Creative Center', status: res.status },
        { status: res.status }
      )
    }

    const data = await res.json()

    if (data.code !== 0) {
      return NextResponse.json(
        { error: 'Erreur TikTok API', details: data.msg },
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
      { error: 'Erreur de connexion à TikTok Creative Center' },
      { status: 502 }
    )
  }
}
