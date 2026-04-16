import { NextRequest, NextResponse } from 'next/server'
import type { Creative } from '@/app/ads-analyzer/types'

// Try multiple TikTok API endpoints/versions
const TIKTOK_ENDPOINTS = [
  'https://ads.tiktok.com/creative_radar_api/v1/top_ads/list',
  'https://ads.tiktok.com/creative_radar_api/v2/top_ads/list',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const period = searchParams.get('period') || '30'
  const rawCountry = searchParams.get('country') || 'FR'
  const country = rawCountry === 'ALL' ? 'FR' : rawCountry
  const sortBy = searchParams.get('sort_by') || 'like'
  const page = searchParams.get('page') || '1'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const keyword = searchParams.get('q') || ''
  const industry = searchParams.get('industry') || ''

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

  // Try each endpoint
  for (const endpoint of TIKTOK_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}?${queryString}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en',
          'Origin': 'https://ads.tiktok.com',
        },
      })

      if (!res.ok) continue

      const data = await res.json()
      if (data.code !== 0 || !data.data?.materials?.length) continue

      const creatives: Creative[] = data.data.materials.map((ad: any) => ({
        id: `tiktok_${ad.id}`,
        platform: 'tiktok' as const,
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
        tags: ad.tag_list || [],
        country: ad.country_code,
      }))

      return NextResponse.json({
        creatives,
        pagination: {
          page: data.data.pagination?.page || 1,
          total_pages: data.data.pagination?.total_page || 1,
          total_count: data.data.pagination?.total_count || 0,
        },
      })
    } catch {
      continue
    }
  }

  // All endpoints failed
  return NextResponse.json({
    creatives: [],
    pagination: { page: 1, total_pages: 0, total_count: 0 },
    error: 'TikTok API indisponible. L\'API Creative Center bloque les requetes serveur. Utilisez la recherche Meta ou consultez directement ads.tiktok.com/business/creativecenter',
  })
}
