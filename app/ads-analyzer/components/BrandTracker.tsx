'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Trash2, Search, Building2, Loader2 } from 'lucide-react'
import type { TrackedBrand } from '../types'
import { COUNTRIES } from '../types'

interface MetaPage {
  id: string
  name: string
}

export default function BrandTracker({
  brands,
  onAdd,
  onDelete,
  onSearch,
  loading,
}: {
  brands: TrackedBrand[]
  onAdd: (brand: Omit<TrackedBrand, 'id' | 'created_at' | 'updated_at'>) => void
  onDelete: (id: string) => void
  onSearch: (brand: TrackedBrand) => void
  loading: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    meta_page_id: '',
    tiktok_advertiser_id: '',
    industry: '',
    country: 'FR',
    notes: '',
  })

  // ─── Autocomplete state ────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<MetaPage[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchingPages, setSearchingPages] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Search Meta pages with debounce
  const searchMetaPages = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearchingPages(true)
      try {
        const res = await fetch(`/api/ads/meta/pages?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.pages || [])
          setShowSuggestions((data.pages || []).length > 0)
        }
      } catch {
        // silently fail
      } finally {
        setSearchingPages(false)
      }
    }, 400)
  }, [])

  const handleNameChange = (value: string) => {
    setForm({ ...form, name: value })
    searchMetaPages(value)
  }

  const selectSuggestion = (page: MetaPage) => {
    setForm({ ...form, name: page.name, meta_page_id: page.id })
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd(form as any)
    setForm({ name: '', meta_page_id: '', tiktok_advertiser_id: '', industry: '', country: 'FR', notes: '' })
    setShowForm(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid var(--lp-border)',
    borderRadius: 8,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--lp-muted)',
    marginBottom: 4,
    display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          Marques suivies ({brands.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: 'var(--lp-purple)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 16,
            border: '1px solid var(--lp-border)',
            borderRadius: 12,
            marginBottom: 16,
            background: 'var(--lp-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Brand name with autocomplete */}
            <div style={{ position: 'relative' }} ref={suggestionsRef}>
              <label style={labelStyle}>Nom de la marque *</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={inputStyle}
                  placeholder="Tapez un nom de marque..."
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                  required
                  autoComplete="off"
                />
                {searchingPages && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--lp-muted)',
                    }}
                  />
                )}
              </div>
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: '#fff',
                    border: '1px solid var(--lp-border)',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    maxHeight: 220,
                    overflow: 'auto',
                    marginTop: 4,
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: 10, color: 'var(--lp-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--lp-border)' }}>
                    Pages Meta trouvees ({suggestions.length})
                  </div>
                  {suggestions.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => selectSuggestion(page)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 10px',
                        border: 'none',
                        borderBottom: '1px solid #F3F4F6',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--lp-purple-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lp-text)' }}>
                        {page.name}
                      </span>
                      <span style={{ fontSize: 11, color: '#1877F2', background: '#E8F0FE', padding: '1px 6px', borderRadius: 4 }}>
                        ID: {page.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {form.meta_page_id && (
                <div style={{ fontSize: 11, color: '#1877F2', marginTop: 4 }}>
                  Meta Page ID: {form.meta_page_id}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Industrie</label>
              <input
                style={inputStyle}
                placeholder="Ex: E-commerce, SaaS..."
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Meta Page ID</label>
              <input
                style={{ ...inputStyle, background: form.meta_page_id ? '#F0FFF4' : '#fff' }}
                placeholder="Auto-rempli ou saisie manuelle"
                value={form.meta_page_id}
                onChange={(e) => setForm({ ...form, meta_page_id: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>TikTok Advertiser ID</label>
              <input
                style={inputStyle}
                placeholder="ID annonceur TikTok"
                value={form.tiktok_advertiser_id}
                onChange={(e) => setForm({ ...form, tiktok_advertiser_id: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Pays</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {Object.entries(COUNTRIES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <input
                style={inputStyle}
                placeholder="Notes personnelles..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 14px',
                background: '#fff',
                border: '1px solid var(--lp-border)',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                background: 'var(--lp-purple)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sauvegarder
            </button>
          </div>
        </form>
      )}

      {/* Brand list */}
      {brands.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            color: 'var(--lp-muted)',
            border: '2px dashed var(--lp-border)',
            borderRadius: 12,
          }}
        >
          <Building2 size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Aucune marque suivie</p>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>
            Ajoutez des marques pour suivre leurs creatives
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {brands.map((brand) => (
            <div
              key={brand.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid var(--lp-border)',
                borderRadius: 10,
                background: '#fff',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{brand.name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {brand.industry && (
                    <span style={{ fontSize: 11, color: 'var(--lp-muted)', background: 'var(--lp-bg)', padding: '1px 6px', borderRadius: 4 }}>
                      {brand.industry}
                    </span>
                  )}
                  {brand.country && (
                    <span style={{ fontSize: 11, color: 'var(--lp-muted)', background: 'var(--lp-bg)', padding: '1px 6px', borderRadius: 4 }}>
                      {COUNTRIES[brand.country] || brand.country}
                    </span>
                  )}
                  {brand.meta_page_id && (
                    <span style={{ fontSize: 11, color: '#1877F2', background: '#E8F0FE', padding: '1px 6px', borderRadius: 4 }}>
                      Meta: {brand.meta_page_id}
                    </span>
                  )}
                  {brand.tiktok_advertiser_id && (
                    <span style={{ fontSize: 11, color: '#000', background: '#F0F0F0', padding: '1px 6px', borderRadius: 4 }}>
                      TikTok
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => onSearch(brand)}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    background: 'var(--lp-purple-light)',
                    color: 'var(--lp-purple)',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                  Voir ads
                </button>
                <button
                  onClick={() => onDelete(brand.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 8px',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
