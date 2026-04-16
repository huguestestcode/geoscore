import { NextRequest, NextResponse } from 'next/server'
import type { Creative } from '@/app/ads-analyzer/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const country = searchParams.get('country') || 'FR'
  const activeOnly = searchParams.get('active_only') !== 'false'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const pageId = searchParams.get('page_id') || ''

  // Try Graph API if token available
  const token = process.env.META_ADS_LIBRARY_TOKEN
  if (token) {
    const result = await searchWithGraphAPI(token, query, pageId, country, activeOnly, limit)
    if (result.length > 0) {
      return NextResponse.json({ creatives: result, total: result.length })
    }
  }

  // Fallback: demo data
  const demos = getMetaDemoCreatives(query)
  return NextResponse.json({
    creatives: demos.slice(0, limit),
    total: demos.length,
    source: 'demo',
  })
}

async function searchWithGraphAPI(
  token: string, query: string, pageId: string,
  country: string, activeOnly: boolean, limit: number
): Promise<Creative[]> {
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
    }))
  } catch {
    return []
  }
}

// ─── Demo Meta Ads ───────────────────────────────────────────────────────────
function getMetaDemoCreatives(keyword: string): Creative[] {
  const demos: Creative[] = [
    {
      id: 'meta_demo_1',
      platform: 'meta',
      brand_name: 'HelloFresh',
      headline: 'Cuisinez comme un chef sans effort',
      body_text: 'Recevez chaque semaine des ingredients frais et des recettes simples livrees chez vous. Plus de 30 recettes au choix. -65% sur votre premiere commande + livraison OFFERTE.',
      cta: 'Commander',
      impressions_lower: 500000,
      impressions_upper: 600000,
      spend_lower: 8000,
      spend_upper: 9000,
      start_date: '2025-03-01T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_2',
      platform: 'meta',
      brand_name: 'HelloFresh',
      headline: 'Marre de vous demander "On mange quoi ce soir ?"',
      body_text: 'HelloFresh resout ce probleme pour vous. Des recettes variees, des ingredients pre-doses, prets en 30 min max. Essayez sans engagement.',
      cta: 'En savoir plus',
      impressions_lower: 800000,
      impressions_upper: 1000000,
      spend_lower: 15000,
      spend_upper: 18000,
      start_date: '2025-02-15T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_3',
      platform: 'meta',
      brand_name: 'Nike',
      headline: 'Air Max Dn - Nee pour bouger',
      body_text: 'Decouvrez la nouvelle Air Max Dn. Une technologie d\'amorti revolutionnaire pour un confort inegalable au quotidien. Disponible maintenant.',
      cta: 'Acheter',
      impressions_lower: 2000000,
      impressions_upper: 3000000,
      spend_lower: 45000,
      spend_upper: 55000,
      start_date: '2025-03-10T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_4',
      platform: 'meta',
      brand_name: 'Sephora',
      headline: 'Votre routine skincare a prix mini',
      body_text: 'Jusqu\'a -40% sur une selection de soins best-sellers. The Ordinary, CeraVe, La Roche-Posay... Offre valable jusqu\'au 31 mars. Livraison gratuite des 60€.',
      cta: 'Decouvrir',
      impressions_lower: 1200000,
      impressions_upper: 1500000,
      spend_lower: 22000,
      spend_upper: 28000,
      start_date: '2025-03-05T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_5',
      platform: 'meta',
      brand_name: 'Dyson',
      headline: 'Pourquoi 2 millions de femmes ont adopte l\'Airwrap',
      body_text: 'Sechez, bouclez et lissez avec un seul appareil. Sans chaleur extreme. Vos cheveux vous remercieront. Livraison offerte + garantie 2 ans.',
      cta: 'Decouvrir',
      impressions_lower: 3000000,
      impressions_upper: 4000000,
      spend_lower: 60000,
      spend_upper: 75000,
      start_date: '2025-01-20T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_6',
      platform: 'meta',
      brand_name: 'Revolut',
      headline: 'Arretez de payer des frais bancaires inutiles',
      body_text: 'Compte gratuit. Carte gratuite. 0 frais a l\'etranger. Rejoignez les 40M+ de clients Revolut. Ouvrez votre compte en 5 minutes depuis l\'app.',
      cta: 'S\'inscrire',
      impressions_lower: 1800000,
      impressions_upper: 2200000,
      spend_lower: 35000,
      spend_upper: 42000,
      start_date: '2025-02-10T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_7',
      platform: 'meta',
      brand_name: 'Gymshark',
      headline: 'La tenue que tout le monde vous demande a la salle',
      body_text: 'Nouvelle collection Vital Seamless. Confort extreme, maintien parfait. -20% pour les nouveaux clients avec le code NEWGYM.',
      cta: 'Acheter',
      impressions_lower: 900000,
      impressions_upper: 1100000,
      spend_lower: 18000,
      spend_upper: 22000,
      start_date: '2025-03-15T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_8',
      platform: 'meta',
      brand_name: 'Airbnb',
      headline: 'Vos prochaines vacances a partir de 35€/nuit',
      body_text: 'Des logements uniques partout en France et en Europe. Maisons, appartements, cabanes, chateaux... Reservez maintenant, payez plus tard.',
      cta: 'Reserver',
      impressions_lower: 4000000,
      impressions_upper: 5000000,
      spend_lower: 80000,
      spend_upper: 95000,
      start_date: '2025-02-01T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_9',
      platform: 'meta',
      brand_name: 'Duolingo',
      headline: '5 minutes par jour pour parler une nouvelle langue',
      body_text: 'Rejoignez 500M+ d\'utilisateurs. Methode gamifiee, 100% gratuite. Espagnol, anglais, allemand, italien et 30+ langues disponibles.',
      cta: 'Telecharger',
      impressions_lower: 2500000,
      impressions_upper: 3500000,
      spend_lower: 50000,
      spend_upper: 65000,
      start_date: '2025-01-15T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
    {
      id: 'meta_demo_10',
      platform: 'meta',
      brand_name: 'Amazon',
      headline: 'Les deals du printemps sont arrives',
      body_text: 'Jusqu\'a -50% sur des milliers d\'articles. High-tech, maison, mode, cuisine... Livraison gratuite et rapide avec Prime. Offre limitee.',
      cta: 'Voir les offres',
      impressions_lower: 6000000,
      impressions_upper: 8000000,
      spend_lower: 120000,
      spend_upper: 150000,
      start_date: '2025-03-18T00:00:00Z',
      is_active: true,
      languages: ['fr'],
    },
  ]

  if (!keyword) return demos

  const kw = keyword.toLowerCase()
  const filtered = demos.filter(
    (d) =>
      d.brand_name.toLowerCase().includes(kw) ||
      d.headline?.toLowerCase().includes(kw) ||
      d.body_text?.toLowerCase().includes(kw)
  )

  return filtered.length > 0 ? filtered : demos
}
