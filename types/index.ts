export type AuditTier = 'free' | 'paid' | 'saas'

export interface LLMResult {
  llm: 'chatgpt' | 'perplexity' | 'gemini'
  prompt: string
  mentioned: boolean
  sentiment: 'positive' | 'neutral' | 'negative' | null
  position: 'first' | 'second' | 'mentioned' | 'not_mentioned'
  response_excerpt: string
}

export interface OnPageFactor {
  key: string
  label: string
  passed: boolean
  weight: number
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'content' | 'technical' | 'authority' | 'structure'
  title: string
  description: string
  impact: string
}

export interface AuditScores {
  llm_score: number
  onpage_score: number
  authority_score: number
  total: number
}

export interface Audit {
  id: string
  url: string
  email: string
  keywords: string[]
  score: number
  llm_results: LLMResult[]
  onpage_results: OnPageFactor[]
  recommendations: Recommendation[]
  tier: AuditTier
  pdf_url: string | null
  user_id: string | null
  stripe_session_id: string | null
  created_at: string
  status?: 'pending' | 'running' | 'completed' | 'error'
  error_message?: string
  scores?: AuditScores
}

export interface TrackedSite {
  id: string
  user_id: string
  url: string
  keywords: string[]
  is_competitor: boolean
  created_at: string
}

export interface AuditHistory {
  id: string
  tracked_site_id: string
  score: number
  llm_results: LLMResult[]
  onpage_results: OnPageFactor[]
  recommendations: Recommendation[]
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'cancelled' | 'past_due'
  created_at: string
}
