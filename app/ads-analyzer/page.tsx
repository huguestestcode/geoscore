'use client'

import { useState, useCallback } from 'react'
import {
  Search,
  TrendingUp,
  Building2,
  Sparkles,
  Filter,
  Loader2,
  RefreshCw,
  LayoutGrid,
  Zap,
} from 'lucide-react'
import type {
  Creative,
  CreativeAnalysis,
  TrackedBrand,
  Platform,
  SearchFilters,
} from './types'
import { TIKTOK_INDUSTRIES, COUNTRIES } from './types'
import CreativeCard from './components/CreativeCard'
import AnalysisModal from './components/AnalysisModal'
import BrandTracker from './components/BrandTracker'

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'search', label: 'Recherche', icon: Search },
  { id: 'brands', label: 'Marques', icon: Building2 },
  { id: 'trends', label: 'Tendances', icon: TrendingUp },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdsAnalyzerPage() {
  // ─── State ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>('search')
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    platform: 'all',
    country: 'FR',
    active_only: true,
    sort_by: 'impressions',
    period: 30,
    limit: 20,
  })
  const [showFilters, setShowFilters] = useState(false)

  // Brands
  const [brands, setBrands] = useState<TrackedBrand[]>([])
  const [brandsLoaded, setBrandsLoaded] = useState(false)

  // Analysis
  const [analysis, setAnalysis] = useState<CreativeAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Trends
  const [trendCreatives, setTrendCreatives] = useState<Creative[]>([])
  const [trendSort, setTrendSort] = useState('like')

  // ─── Search ──────────────────────────────────────────────────────────
  const doSearch = useCallback(async (overrides?: Partial<SearchFilters>) => {
    const f = { ...filters, ...overrides }
    setLoading(true)
    setError(null)
    setCreatives([])

    try {
      const results: Creative[] = []

      // Meta search
      if (f.platform === 'all' || f.platform === 'meta') {
        const params = new URLSearchParams()
        if (f.query) params.set('q', f.query)
        if (f.page_id) params.set('page_id', f.page_id)
        params.set('country', f.country || 'FR')
        params.set('active_only', String(f.active_only !== false))
        params.set('limit', String(f.limit || 20))

        const res = await fetch(`/api/ads/meta/library?${params}`)
        if (res.ok) {
          const data = await res.json()
          results.push(...(data.creatives || []))
        }
      }

      // TikTok search
      if (f.platform === 'all' || f.platform === 'tiktok') {
        const params = new URLSearchParams()
        if (f.query) params.set('q', f.query)
        const tiktokCountry = f.country === 'ALL' ? 'FR' : (f.country || 'FR')
        params.set('country', tiktokCountry)
        params.set('period', String(f.period || 30))
        params.set('sort_by', f.sort_by === 'likes' ? 'like' : f.sort_by === 'ctr' ? 'ctr' : 'like')
        params.set('limit', String(f.limit || 20))
        if (f.industry) params.set('industry', f.industry)

        const res = await fetch(`/api/ads/tiktok/top-ads?${params}`)
        const data = await res.json()
        results.push(...(data.creatives || []))
      }

      setCreatives(results)
      if (results.length === 0) {
        setError('Aucune creative trouvee. Pour des resultats reels, ajoutez un META_ADS_LIBRARY_TOKEN (gratuit, sans CB) dans le fichier .env — instructions sur developers.facebook.com/tools/explorer/')
      }
    } catch {
      setError('Erreur de connexion aux APIs.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // ─── AI Analysis ─────────────────────────────────────────────────────
  const analyzeCreative = useCallback(async (creative: Creative) => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/ads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creative_id: creative.id,
          creative_url: creative.media_url || creative.video_url,
          creative_text: [creative.headline, creative.body_text, creative.cta]
            .filter(Boolean)
            .join('\n\n'),
          platform: creative.platform,
        }),
      })
      if (!res.ok) throw new Error('Erreur analyse')
      const data: CreativeAnalysis = await res.json()
      setAnalysis(data)
    } catch {
      setError('Erreur lors de l\'analyse IA. Verifiez votre cle OpenAI.')
    } finally {
      setAnalyzing(false)
    }
  }, [])

  // ─── Brand management ────────────────────────────────────────────────
  const loadBrands = useCallback(async () => {
    if (brandsLoaded) return
    try {
      const res = await fetch('/api/ads/brands')
      if (res.ok) {
        const data = await res.json()
        setBrands(data.brands || [])
      }
    } catch { /* ignore */ }
    setBrandsLoaded(true)
  }, [brandsLoaded])

  const addBrand = useCallback(async (brand: Omit<TrackedBrand, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/ads/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      })
      if (res.ok) {
        const data = await res.json()
        setBrands((prev) => [data.brand, ...prev])
      }
    } catch { /* ignore */ }
  }, [])

  const deleteBrand = useCallback(async (id: string) => {
    try {
      await fetch(`/api/ads/brands?id=${id}`, { method: 'DELETE' })
      setBrands((prev) => prev.filter((b) => b.id !== id))
    } catch { /* ignore */ }
  }, [])

  const searchBrand = useCallback((brand: TrackedBrand) => {
    setActiveTab('search')
    const newFilters: SearchFilters = {
      ...filters,
      query: brand.name,
      page_id: brand.meta_page_id || undefined,
      country: brand.country || 'FR',
    }
    setFilters(newFilters)
    doSearch(newFilters)
  }, [filters, doSearch])

  // ─── Trends ──────────────────────────────────────────────────────────
  const loadTrends = useCallback(async (sortBy?: string) => {
    setLoading(true)
    const sort = sortBy || trendSort
    try {
      const results: Creative[] = []

      // TikTok trends
      const ttParams = new URLSearchParams({ period: '30', country: 'FR', sort_by: sort, limit: '10' })
      const ttRes = await fetch(`/api/ads/tiktok/top-ads?${ttParams}`)
      const ttData = await ttRes.json()
      results.push(...(ttData.creatives || []))

      // Meta trends
      const metaRes = await fetch(`/api/ads/meta/library?q=&country=FR&limit=10`)
      const metaData = await metaRes.json()
      results.push(...(metaData.creatives || []))

      // Shuffle to mix platforms
      results.sort(() => Math.random() - 0.5)
      setTrendCreatives(results)
    } catch { /* ignore */ }
    setLoading(false)
  }, [trendSort])

  // ─── Tab change handler ──────────────────────────────────────────────
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    if (tab === 'brands') loadBrands()
    if (tab === 'trends' && trendCreatives.length === 0) loadTrends()
  }

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--lp-bg)' }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)',
          color: '#fff',
          padding: '32px 24px 20px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--lp-purple), #A855F7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={20} />
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
              Ads Creative Analyzer
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
            Analysez les meilleures creatives Meta & TikTok. Identifiez les hooks, scripts et
            tendances pour reproduire ce qui marche.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--lp-border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0, padding: '0 24px' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--lp-purple)' : '2px solid transparent',
                  background: 'none',
                  color: isActive ? 'var(--lp-purple)' : 'var(--lp-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 60px' }}>
        {/* ─── SEARCH TAB ─── */}
        {activeTab === 'search' && (
          <div>
            {/* Search bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--lp-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Rechercher par marque, mot-cle, produit..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--lp-border)',
                    borderRadius: 10,
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 14px',
                  border: '1px solid var(--lp-border)',
                  borderRadius: 10,
                  background: showFilters ? 'var(--lp-purple-light)' : '#fff',
                  color: showFilters ? 'var(--lp-purple)' : 'var(--lp-text)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <Filter size={14} /> Filtres
              </button>
              <button
                onClick={() => doSearch()}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  background: 'var(--lp-purple)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Rechercher
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                  padding: 16,
                  background: '#fff',
                  border: '1px solid var(--lp-border)',
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <FilterSelect
                  label="Plateforme"
                  value={filters.platform || 'all'}
                  onChange={(v) => setFilters({ ...filters, platform: v as Platform | 'all' })}
                  options={[
                    { value: 'all', label: 'Toutes' },
                    { value: 'meta', label: 'Meta (FB/IG)' },
                    { value: 'tiktok', label: 'TikTok' },
                  ]}
                />
                <FilterSelect
                  label="Pays"
                  value={filters.country || 'FR'}
                  onChange={(v) => setFilters({ ...filters, country: v })}
                  options={Object.entries(COUNTRIES).map(([code, name]) => ({
                    value: code,
                    label: name,
                  }))}
                />
                <FilterSelect
                  label="Periode"
                  value={String(filters.period || 30)}
                  onChange={(v) => setFilters({ ...filters, period: parseInt(v) as 7 | 30 | 180 })}
                  options={[
                    { value: '7', label: '7 jours' },
                    { value: '30', label: '30 jours' },
                    { value: '180', label: '6 mois' },
                  ]}
                />
                <FilterSelect
                  label="Trier par"
                  value={filters.sort_by || 'impressions'}
                  onChange={(v) => setFilters({ ...filters, sort_by: v as any })}
                  options={[
                    { value: 'impressions', label: 'Impressions' },
                    { value: 'spend', label: 'Depense' },
                    { value: 'likes', label: 'Likes' },
                    { value: 'ctr', label: 'CTR' },
                    { value: 'recency', label: 'Recentes' },
                  ]}
                />
                <FilterSelect
                  label="Industrie (TikTok)"
                  value={filters.industry || ''}
                  onChange={(v) => setFilters({ ...filters, industry: v })}
                  options={Object.entries(TIKTOK_INDUSTRIES).map(([id, name]) => ({
                    value: id,
                    label: name,
                  }))}
                />
                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filters.active_only !== false}
                      onChange={(e) => setFilters({ ...filters, active_only: e.target.checked })}
                      style={{ accentColor: 'var(--lp-purple)' }}
                    />
                    Actives uniquement
                  </label>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--lp-muted)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 14 }}>Recherche en cours...</p>
              </div>
            )}

            {/* Results grid */}
            {!loading && creatives.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--lp-muted)' }}>
                    {creatives.length} creative{creatives.length > 1 ? 's' : ''} trouvee{creatives.length > 1 ? 's' : ''}
                  </span>
                  <LayoutGrid size={16} color="var(--lp-muted)" />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 16,
                  }}
                >
                  {creatives.map((c) => (
                    <CreativeCard key={c.id} creative={c} onAnalyze={analyzeCreative} />
                  ))}
                </div>
              </>
            )}

            {/* Empty state */}
            {!loading && creatives.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--lp-muted)' }}>
                <Search size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--lp-text)' }}>
                  Recherchez des creatives
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 14 }}>
                  Entrez un mot-cle ou un nom de marque pour decouvrir leurs publicites
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── BRANDS TAB ─── */}
        {activeTab === 'brands' && (
          <BrandTracker
            brands={brands}
            onAdd={addBrand}
            onDelete={deleteBrand}
            onSearch={searchBrand}
            loading={loading}
          />
        )}

        {/* ─── TRENDS TAB ─── */}
        {activeTab === 'trends' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Top creatives Meta & TikTok — Tendances
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { value: 'like', label: 'Likes' },
                  { value: 'ctr', label: 'CTR' },
                  { value: 'impression', label: 'Vues' },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setTrendSort(s.value)
                      loadTrends(s.value)
                    }}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--lp-border)',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: trendSort === s.value ? 700 : 500,
                      background: trendSort === s.value ? 'var(--lp-purple)' : '#fff',
                      color: trendSort === s.value ? '#fff' : 'var(--lp-text)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  onClick={() => loadTrends()}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 10px',
                    border: '1px solid var(--lp-border)',
                    borderRadius: 8,
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--lp-muted)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 14 }}>Chargement des tendances...</p>
              </div>
            ) : trendCreatives.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 16,
                }}
              >
                {trendCreatives.map((c, i) => (
                  <div key={c.id} style={{ position: 'relative' }}>
                    {i < 3 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -6,
                          left: -6,
                          zIndex: 10,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 13,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        {i + 1}
                      </div>
                    )}
                    <CreativeCard creative={c} onAnalyze={analyzeCreative} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--lp-muted)' }}>
                <TrendingUp size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: 14 }}>Aucune tendance disponible</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analysis Modal */}
      {analysis && <AnalysisModal analysis={analysis} onClose={() => setAnalysis(null)} />}

      {/* Analyzing overlay */}
      {analyzing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
          }}
        >
          <Sparkles size={40} style={{ marginBottom: 12 }} className="animate-pulse" />
          <p style={{ fontSize: 16, fontWeight: 600 }}>Analyse IA en cours...</p>
          <p style={{ fontSize: 13, opacity: 0.7 }}>
            Hooks, scripts, visuels, score de performance
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Filter Select Component ─────────────────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--lp-muted)',
          marginBottom: 4,
          display: 'block',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid var(--lp-border)',
          borderRadius: 8,
          fontSize: 13,
          outline: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          background: '#fff',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
