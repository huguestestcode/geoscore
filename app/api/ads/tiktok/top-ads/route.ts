import { NextRequest, NextResponse } from 'next/server'
import type { Creative } from '@/app/ads-analyzer/types'

const TIKTOK_API_URL = 'https://ads.tiktok.com/creative_radar_api/v1/top_ads/list'

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

  // Try TikTok Creative Center API
  try {
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

    const res = await fetch(`${TIKTOK_API_URL}?${queryString}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en',
        'Origin': 'https://ads.tiktok.com',
      },
    })

    if (res.ok) {
      const data = await res.json()
      if (data.code === 0 && data.data?.materials?.length > 0) {
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
      }
    }
  } catch (e) {
    console.error('TikTok API error:', e)
  }

  // ─── Fallback: demo data so the UI works ───────────────────────────
  const demoCreatives = getDemoCreatives(keyword, country)

  return NextResponse.json({
    creatives: demoCreatives.slice(0, limit),
    pagination: { page: 1, total_pages: 1, total_count: demoCreatives.length },
    source: 'demo',
  })
}

// ─── Demo data ───────────────────────────────────────────────────────────────
function getDemoCreatives(keyword: string, country: string): Creative[] {
  const demos: Creative[] = [
    {
      id: 'tiktok_demo_1',
      platform: 'tiktok',
      brand_name: 'HelloFresh',
      headline: 'Plus besoin de reflechir a quoi manger ce soir ! HelloFresh livre tout chez vous avec les recettes.',
      body_text: 'Recevez des ingredients frais et des recettes faciles. -60% sur votre premiere box avec le code TIKTOK60.',
      media_url: '',
      likes: 245000,
      comments: 3200,
      shares: 18500,
      views: 4200000,
      ctr: 3.2,
      start_date: '2025-03-15T00:00:00Z',
      is_active: true,
      tags: ['food', 'delivery', 'cooking'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_2',
      platform: 'tiktok',
      brand_name: 'Gymshark',
      headline: 'POV: Tu portes Gymshark pour la premiere fois a la salle',
      body_text: 'La nouvelle collection est dispo. Livraison gratuite des 50€.',
      media_url: '',
      likes: 890000,
      comments: 12400,
      shares: 45000,
      views: 12000000,
      ctr: 4.1,
      start_date: '2025-02-20T00:00:00Z',
      is_active: true,
      tags: ['fitness', 'gym', 'fashion'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_3',
      platform: 'tiktok',
      brand_name: 'Dyson',
      headline: 'Pourquoi tout le monde parle du Dyson Airwrap ? Voici le resultat sur mes cheveux.',
      body_text: 'Le seul outil dont vous avez besoin. Decouvrez le sur dyson.fr',
      media_url: '',
      likes: 567000,
      comments: 8900,
      shares: 34000,
      views: 8500000,
      ctr: 2.8,
      start_date: '2025-03-01T00:00:00Z',
      is_active: true,
      tags: ['beauty', 'haircare', 'tech'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_4',
      platform: 'tiktok',
      brand_name: 'Duolingo',
      headline: 'Jour 365 de Duolingo. Mon niveau d\'espagnol vs il y a 1 an.',
      body_text: 'Apprends une langue gratuitement. 5 min par jour suffisent.',
      media_url: '',
      likes: 1200000,
      comments: 23000,
      shares: 67000,
      views: 18000000,
      ctr: 5.2,
      start_date: '2025-01-10T00:00:00Z',
      is_active: true,
      tags: ['education', 'languages', 'app'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_5',
      platform: 'tiktok',
      brand_name: 'Nike',
      headline: 'Tu ne cours pas pour les autres. Tu cours pour toi. Just Do It.',
      body_text: 'Nouvelle collection running disponible. Livraison offerte pour les membres Nike.',
      media_url: '',
      likes: 2100000,
      comments: 15600,
      shares: 89000,
      views: 25000000,
      ctr: 3.8,
      start_date: '2025-03-20T00:00:00Z',
      is_active: true,
      tags: ['sport', 'running', 'motivation'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_6',
      platform: 'tiktok',
      brand_name: 'Sephora',
      headline: '3 produits a moins de 15€ qui ont change ma routine skincare',
      body_text: 'Disponibles en magasin et sur sephora.fr. Points triple ce week-end.',
      media_url: '',
      likes: 456000,
      comments: 7800,
      shares: 28000,
      views: 6700000,
      ctr: 3.5,
      start_date: '2025-03-10T00:00:00Z',
      is_active: true,
      tags: ['beauty', 'skincare', 'budget'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_7',
      platform: 'tiktok',
      brand_name: 'Airbnb',
      headline: 'J\'ai trouve cet appart a 45€/nuit a Lisbonne. Voici comment.',
      body_text: 'Reservez des logements uniques partout dans le monde.',
      media_url: '',
      likes: 678000,
      comments: 9100,
      shares: 52000,
      views: 9800000,
      ctr: 4.0,
      start_date: '2025-02-28T00:00:00Z',
      is_active: true,
      tags: ['travel', 'budget', 'lifestyle'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_8',
      platform: 'tiktok',
      brand_name: 'Notion',
      headline: 'Comment j\'organise toute ma vie avec un seul outil (gratuit)',
      body_text: 'Notion est gratuit pour un usage personnel. Commencez maintenant sur notion.so',
      media_url: '',
      likes: 345000,
      comments: 5600,
      shares: 41000,
      views: 5200000,
      ctr: 4.5,
      start_date: '2025-03-05T00:00:00Z',
      is_active: true,
      tags: ['productivity', 'app', 'saas'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_9',
      platform: 'tiktok',
      brand_name: 'Amazon',
      headline: 'Les 10 objets Amazon a moins de 20€ dont vous avez BESOIN',
      body_text: 'Livraison gratuite avec Prime. Liens dans la bio.',
      media_url: '',
      likes: 789000,
      comments: 11200,
      shares: 56000,
      views: 11000000,
      ctr: 3.9,
      start_date: '2025-03-12T00:00:00Z',
      is_active: true,
      tags: ['ecommerce', 'deals', 'shopping'],
      country: 'FR',
    },
    {
      id: 'tiktok_demo_10',
      platform: 'tiktok',
      brand_name: 'Revolut',
      headline: 'J\'economise 200€/mois depuis que j\'utilise cette app',
      body_text: 'Ouvrez un compte en 5 minutes. Sans frais. Sans paperasse.',
      media_url: '',
      likes: 523000,
      comments: 6700,
      shares: 38000,
      views: 7800000,
      ctr: 4.3,
      start_date: '2025-02-15T00:00:00Z',
      is_active: true,
      tags: ['finance', 'fintech', 'saving'],
      country: 'FR',
    },
  ]

  // Filter by keyword if provided
  let filtered = demos
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = demos.filter(
      (d) =>
        d.brand_name.toLowerCase().includes(kw) ||
        d.headline?.toLowerCase().includes(kw) ||
        d.tags?.some((t) => t.toLowerCase().includes(kw))
    )
  }

  return filtered
}
