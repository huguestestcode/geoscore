// ─── Platforms ────────────────────────────────────────────────────────────────
export type Platform = 'meta' | 'tiktok'

// ─── Meta Ad Library ─────────────────────────────────────────────────────────
export interface MetaAd {
  id: string
  page_id: string
  page_name: string
  ad_creation_time: string
  ad_delivery_start_time: string
  ad_delivery_stop_time?: string
  ad_creative_bodies?: string[]
  ad_creative_link_titles?: string[]
  ad_creative_link_descriptions?: string[]
  ad_creative_link_captions?: string[]
  ad_snapshot_url: string
  bylines?: string[]
  publisher_platforms?: string[]
  languages?: string[]
  impressions?: { lower_bound: string; upper_bound: string }
  spend?: { lower_bound: string; upper_bound: string; currency: string }
  demographic_distribution?: Array<{
    age: string
    gender: string
    percentage: string
  }>
  delivery_by_region?: Array<{
    region: string
    percentage: string
  }>
  estimated_audience_size?: { lower_bound: string; upper_bound: string }
}

export interface MetaSearchResponse {
  data: MetaAd[]
  paging?: {
    cursors: { before: string; after: string }
    next?: string
  }
}

// ─── TikTok Creative Center ─────────────────────────────────────────────────
export interface TikTokAd {
  id: string
  ad_title: string
  brand_name: string
  like_cnt: number
  comment_cnt: number
  share_cnt: number
  view_cnt: number
  ctr: number
  cost: number
  video_info: {
    duration: number
    cover: string
    vid: string
    video_url: string
    width: number
    height: number
  }
  industry_name: string
  objective_type: string
  country_code: string
  tag_list: string[]
  landing_page_url?: string
  audit_status: number
}

export interface TikTokTopAdsResponse {
  code: number
  msg: string
  data: {
    materials: TikTokAd[]
    pagination: {
      page: number
      size: number
      total_page: number
      total_count: number
    }
  }
}

// ─── Unified Creative ────────────────────────────────────────────────────────
export interface Creative {
  id: string
  platform: Platform
  brand_name: string
  brand_id?: string
  headline?: string
  body_text?: string
  cta?: string
  media_url?: string        // snapshot or video cover
  video_url?: string
  landing_page_url?: string
  impressions_lower?: number
  impressions_upper?: number
  spend_lower?: number
  spend_upper?: number
  likes?: number
  comments?: number
  shares?: number
  views?: number
  ctr?: number
  start_date: string
  end_date?: string
  is_active: boolean
  tags?: string[]
  country?: string
  languages?: string[]
  raw_meta?: MetaAd
  raw_tiktok?: TikTokAd
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────
export interface HookAnalysis {
  hook_type: string          // question, statement, shock, curiosity, pain_point, social_proof
  hook_text: string
  hook_duration_seconds?: number
  attention_score: number    // 1-10
  emotional_trigger: string
}

export interface ScriptAnalysis {
  structure: string          // AIDA, PAS, BAB, storytelling, etc.
  sections: Array<{
    label: string
    content: string
    duration_seconds?: number
  }>
  cta_type: string
  cta_text: string
  tone: string
  persuasion_techniques: string[]
}

export interface VisualAnalysis {
  format: 'image' | 'video' | 'carousel'
  dominant_colors: string[]
  has_face: boolean
  has_text_overlay: boolean
  text_overlay_content?: string
  visual_style: string       // UGC, studio, motion_graphics, screenshot, etc.
  aspect_ratio: string
}

export interface CreativeAnalysis {
  id: string
  creative_id: string
  platform: Platform
  hook: HookAnalysis
  script: ScriptAnalysis
  visual: VisualAnalysis
  overall_score: number      // 1-100
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  similar_winning_patterns: string[]
  reproduction_brief: string // Actionable brief to reproduce this creative
  analyzed_at: string
}

// ─── Brand Tracking ──────────────────────────────────────────────────────────
export interface TrackedBrand {
  id: string
  name: string
  meta_page_id?: string
  tiktok_advertiser_id?: string
  logo_url?: string
  industry?: string
  country?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ─── Trends ──────────────────────────────────────────────────────────────────
export interface TrendPattern {
  pattern_name: string
  description: string
  frequency: number          // how many top ads use this pattern
  examples: string[]
  platforms: Platform[]
  hook_types: string[]
  avg_performance_score: number
}

// ─── API Request/Response ────────────────────────────────────────────────────
export interface SearchFilters {
  query?: string
  platform?: Platform | 'all'
  country?: string
  active_only?: boolean
  sort_by?: 'impressions' | 'spend' | 'recency' | 'likes' | 'ctr'
  page_id?: string            // for brand-specific search
  industry?: string
  period?: 7 | 30 | 180
  limit?: number
  cursor?: string
}

export interface AnalyzeRequest {
  creative_url?: string       // snapshot URL or video URL
  creative_text?: string      // ad copy text
  platform: Platform
  include_reproduction_brief?: boolean
}

// ─── TikTok Industries ──────────────────────────────────────────────────────
export const TIKTOK_INDUSTRIES: Record<string, string> = {
  '': 'Toutes industries',
  '1': 'Vêtements & Accessoires',
  '2': 'Beauté & Soins',
  '3': 'Éducation',
  '4': 'Finance',
  '5': 'Jeux',
  '6': 'Technologie',
  '7': 'Maison & Jardin',
  '8': 'Alimentation & Boissons',
  '9': 'Voyage',
  '10': 'Auto',
  '11': 'Bébé & Enfant',
  '12': 'Animaux',
  '13': 'Sport & Plein air',
  '14': 'Électronique',
  '15': 'Divertissement',
  '16': 'Services',
  '17': 'E-commerce',
  '18': 'Apps',
  '19': 'Santé',
  '20': 'Immobilier',
}

export const COUNTRIES: Record<string, string> = {
  FR: 'France',
  US: 'États-Unis',
  GB: 'Royaume-Uni',
  DE: 'Allemagne',
  ES: 'Espagne',
  IT: 'Italie',
  BR: 'Brésil',
  CA: 'Canada',
  AU: 'Australie',
  NL: 'Pays-Bas',
  BE: 'Belgique',
  CH: 'Suisse',
  PT: 'Portugal',
  JP: 'Japon',
  KR: 'Corée du Sud',
}
