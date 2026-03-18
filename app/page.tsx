'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import {
  Building2, MapPin, TrendingDown, Calculator,
  CheckCircle2, ArrowRight, Info, ChevronDown,
  Sparkles, Shield, Clock, Star, Search, Loader2, X, AlertTriangle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Commune = {
  nom: string
  code: string           // code INSEE
  codesPostaux: string[]
  codeDepartement: string
  population?: number
}

type CFETaux = {
  taux: number       // taux global CFE (%)
  nom: string
  annee: number
  source: string
}

// ─── Legal constants — Article 1647 D CGI (barème 2026) ──────────────────────
// Plafonds de la base minimum de CFE par tranche de CA (N-2)
const LEGAL_CEILING = [589, 1179, 2477, 4129, 5897, 7669]
const LEGAL_FLOOR   = [247,  247,  247,  247,  247,  247]
const CA_THRESHOLDS = [10000, 32600, 100000, 250000, 500000]

function getTranche(ca: number): number {
  for (let i = 0; i < CA_THRESHOLDS.length; i++) {
    if (ca <= CA_THRESHOLDS[i]) return i
  }
  return 5
}

function estimateCFE(taux: number, ca: number): { min: number; max: number } {
  const t = getTranche(ca)
  return {
    min: Math.round(LEGAL_FLOOR[t] * taux / 100),
    max: Math.round(LEGAL_CEILING[t] * taux / 100),
  }
}

function isExempt(statut: string, ca: number): boolean {
  return statut === 'ae' && ca <= 5000
}

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function fmtCA(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`
  if (n >= 1_000) return `${Math.round(n / 1_000)} K€`
  return `${n} €`
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PARIS_CODE = '75056'

const STATUTS = [
  { id: 'ae',   name: 'Auto-entrepreneur / Micro-entreprise' },
  { id: 'eurl', name: 'EURL' },
  { id: 'sarl', name: 'SARL' },
  { id: 'sas',  name: 'SAS' },
  { id: 'sasu', name: 'SASU' },
  { id: 'sci',  name: 'SCI' },
  { id: 'ei',   name: 'Entreprise Individuelle (EI)' },
]

const CA_PRESETS = [
  { label: '5 000 €',    value: 5000 },
  { label: '20 000 €',   value: 20000 },
  { label: '50 000 €',   value: 50000 },
  { label: '100 000 €',  value: 100000 },
  { label: '250 000 €',  value: 250000 },
  { label: '500 000 €',  value: 500000 },
]

// ─── API functions ────────────────────────────────────────────────────────────
async function searchCommunes(query: string): Promise<Commune[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const isPostal = /^\d{2,5}$/.test(q)
  const url = isPostal
    ? `https://geo.api.gouv.fr/communes?codePostal=${q}&fields=nom,code,codesPostaux,codeDepartement,population&boost=population`
    : `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&fields=nom,code,codesPostaux,codeDepartement,population&boost=population&limit=8`

  const res = await fetch(url)
  if (!res.ok) return []
  const data: Commune[] = await res.json()
  return data.slice(0, 8)
}

async function fetchCFETaux(codeInsee: string): Promise<CFETaux | null> {
  const res = await fetch(`/api/cfe-taux?code=${codeInsee}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.error) return null
  return data as CFETaux
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CommuneSearch({ onSelect, selected }: {
  onSelect: (c: Commune | null) => void
  selected: Commune | null
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Commune[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(val: string) {
    setQuery(val)
    if (selected) onSelect(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchCommunes(val)
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  function handleSelect(c: Commune) {
    const cp = c.codesPostaux?.[0] || ''
    setQuery(`${c.nom} (${cp})`)
    setOpen(false)
    setResults([])
    onSelect(c)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
    onSelect(null)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
        <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
        Ville actuelle du siège social
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: selected ? '1.5px solid #6C3BFF' : '1.5px solid #D1D5DB',
        borderRadius: '10px', overflow: 'hidden',
        background: selected ? '#F5F3FF' : '#fff',
        transition: 'all 0.2s',
      }}>
        <Search size={16} color="#9CA3AF" style={{ marginLeft: '14px', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Tapez une ville ou un code postal..."
          style={{
            flex: 1, padding: '12px', border: 'none', outline: 'none',
            fontSize: '15px', color: '#1A1A2E', background: 'transparent',
          }}
        />
        {loading && <Loader2 size={16} color="#6C3BFF" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />}
        {selected && (
          <button onClick={handleClear} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
            color: '#6B7280', display: 'flex', alignItems: 'center',
          }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: '4px',
          maxHeight: '280px', overflowY: 'auto',
        }}>
          {results.map(c => (
            <button
              key={c.code}
              onClick={() => handleSelect(c)}
              style={{
                width: '100%', padding: '12px 16px', border: 'none',
                background: 'transparent', cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F5F3FF')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E' }}>
                  {c.nom}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {c.codesPostaux?.slice(0, 3).join(', ')}{c.codesPostaux?.length > 3 ? '...' : ''} — Dép. {c.codeDepartement}
                </div>
              </div>
              {c.population && (
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  {(c.population / 1000).toFixed(0)}k hab.
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SavingsBar({ label, amount, maxAmount, isLegalPlace = false }: {
  label: string; amount: number; maxAmount: number; isLegalPlace?: boolean
}) {
  const pct = Math.max(5, Math.round((amount / maxAmount) * 100))
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: isLegalPlace ? '#5B21B6' : '#374151', fontWeight: isLegalPlace ? 700 : 400 }}>
          {isLegalPlace ? '★ ' : ''}{label}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: isLegalPlace ? '#5B21B6' : '#111827' }}>
          {fmt(amount)}
        </span>
      </div>
      <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
        <div className="bar-fill" style={{
          height: '100%', width: `${pct}%`, borderRadius: '4px',
          background: isLegalPlace ? 'linear-gradient(90deg, #6C3BFF, #A78BFA)' : '#D1D5DB',
        }} />
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden',
      boxShadow: open ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', transition: 'box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '18px 20px', background: '#fff',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E' }}>{question}</span>
        <ChevronDown size={18} color="#6B7280" style={{
          flexShrink: 0, transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#4B5563', lineHeight: 1.7, background: '#fff' }}>
          {answer}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SimulateurCFE() {
  // Form state
  const [statut, setStatut]       = useState('sas')
  const [ca, setCa]               = useState(50000)
  const [caInput, setCaInput]     = useState('50000')
  const [commune, setCommune]     = useState<Commune | null>(null)

  // CFE data state
  const [communeTaux, setCommuneTaux] = useState<CFETaux | null>(null)
  const [parisTaux, setParisTaux]     = useState<CFETaux | null>(null)
  const [loadingTaux, setLoadingTaux] = useState(false)
  const [tauxError, setTauxError]     = useState<string | null>(null)

  // UI state
  const [step, setStep] = useState<'form' | 'results'>('form')
  const resultsRef      = useRef<HTMLDivElement>(null)

  // Pre-fetch Paris taux on mount
  useEffect(() => {
    fetchCFETaux(PARIS_CODE).then(t => {
      if (t) setParisTaux(t)
    })
  }, [])

  // Fetch commune taux when commune is selected
  const handleCommuneSelect = useCallback(async (c: Commune | null) => {
    setCommune(c)
    setCommuneTaux(null)
    setTauxError(null)
    setStep('form')

    if (!c) return

    setLoadingTaux(true)
    try {
      const taux = await fetchCFETaux(c.code)
      if (taux) {
        setCommuneTaux(taux)
      } else {
        setTauxError(`Taux CFE non trouvé pour ${c.nom}. La commune n'est peut-être pas encore dans la base open data.`)
      }
    } catch {
      setTauxError('Erreur lors de la récupération du taux CFE. Veuillez réessayer.')
    } finally {
      setLoadingTaux(false)
    }
  }, [])

  // Compute results
  const results = useMemo(() => {
    if (!commune || !communeTaux || !parisTaux) return null

    const exempt = isExempt(statut, ca)
    if (exempt) return { exempt: true as const }

    const userCFE  = estimateCFE(communeTaux.taux, ca)
    const parisCFE = estimateCFE(parisTaux.taux, ca)

    return {
      exempt: false as const,
      userMax: userCFE.max,
      userMin: userCFE.min,
      parisMax: parisCFE.max,
      parisMin: parisCFE.min,
      savingsMax: userCFE.max - parisCFE.max,
      savingsMin: userCFE.min - parisCFE.min,
      isCheaper: userCFE.max > parisCFE.max,
      userTaux: communeTaux.taux,
      parisTaux: parisTaux.taux,
    }
  }, [commune, communeTaux, parisTaux, statut, ca])

  function handleCalculate() {
    if (!results) return
    setStep('results')
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleCAChange(val: string) {
    setCaInput(val)
    const n = parseInt(val.replace(/\s/g, ''), 10)
    if (!isNaN(n) && n >= 0) setCa(Math.min(n, 10_000_000))
  }

  const sliderPct = useMemo(() => {
    const log = (v: number) => Math.log10(Math.max(v, 1))
    return ((log(ca) - log(1)) / (log(10_000_000) - log(1))) * 100
  }, [ca])

  const canCalculate = commune && communeTaux && parisTaux && !loadingTaux

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Spinner keyframe (inline for Loader2) */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
            borderRadius: '8px', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#1A1A2E' }}>LegalPlace</span>
        </div>
        <a
          href="https://www.legalplace.fr/domiciliation/"
          target="_blank" rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #6C3BFF, #8B5CF6)',
            color: '#fff', padding: '8px 18px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
          Domicilier mon entreprise <ArrowRight size={14} />
        </a>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FF 50%, #fff 100%)',
        padding: '64px 24px 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="animate-fadeInUp" style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#EDE9FF', color: '#5B21B6',
              padding: '4px 14px', borderRadius: '99px',
              fontSize: '13px', fontWeight: 600,
            }}>
              <Calculator size={13} />
              Simulateur CFE — Données officielles DGFiP
            </span>
          </div>
          <h1 className="animate-fadeInUp delay-100" style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
            lineHeight: 1.15, color: '#1A1A2E', marginBottom: '16px',
          }}>
            Simulez votre CFE en 30 secondes<br />
            <span style={{ color: '#6C3BFF' }}>et comparez avec Paris.</span>
          </h1>
          <p className="animate-fadeInUp delay-200" style={{
            fontSize: '17px', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px',
          }}>
            Taux CFE officiels récupérés en temps réel depuis les données ouvertes de la DGFiP.
            Recherchez n&apos;importe quelle commune de France par nom ou code postal.
          </p>
          <div className="animate-fadeInUp delay-300" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px',
          }}>
            {[
              { icon: <CheckCircle2 size={15} />, text: 'Toutes les communes de France' },
              { icon: <Clock size={15} />, text: 'Taux officiels DGFiP' },
              { icon: <Shield size={15} />, text: '100% gratuit' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280',
              }}>
                <span style={{ color: '#22C55E' }}>{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Simulator card ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: '780px', margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px',
          padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          marginTop: '-24px', position: 'relative', zIndex: 10,
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: '#1A1A2E' }}>
              Renseignez votre situation
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
              Le taux CFE de votre commune est récupéré automatiquement
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>

            {/* Commune search */}
            <CommuneSearch onSelect={handleCommuneSelect} selected={commune} />

            {/* Taux display */}
            {loadingTaux && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 16px', background: '#F5F3FF', borderRadius: '10px',
                fontSize: '13px', color: '#5B21B6',
              }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Récupération du taux CFE officiel...
              </div>
            )}

            {communeTaux && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#F0FDF4', borderRadius: '10px',
                border: '1px solid #86EFAC',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#16A34A" />
                  <span style={{ fontSize: '13px', color: '#166534' }}>
                    Taux CFE {commune?.nom} : <strong>{communeTaux.taux.toFixed(2)}%</strong>
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  Source : {communeTaux.source}
                </span>
              </div>
            )}

            {tauxError && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                padding: '12px 16px', background: '#FEF2F2', borderRadius: '10px',
                border: '1px solid #FECACA',
              }}>
                <AlertTriangle size={14} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#991B1B' }}>{tauxError}</span>
              </div>
            )}

            {/* Paris taux info */}
            {parisTaux && communeTaux && commune?.code !== PARIS_CODE && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 16px', background: '#F5F3FF', borderRadius: '10px',
                border: '1px solid #DDD6FE',
              }}>
                <Sparkles size={14} color="#6C3BFF" />
                <span style={{ fontSize: '13px', color: '#5B21B6' }}>
                  Taux CFE Paris : <strong>{parisTaux.taux.toFixed(2)}%</strong>
                  {communeTaux.taux > parisTaux.taux && (
                    <> — <strong>{(communeTaux.taux - parisTaux.taux).toFixed(2)} points de moins</strong> que {commune?.nom}</>
                  )}
                </span>
              </div>
            )}

            {/* Statut */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Forme juridique
              </label>
              <select
                value={statut}
                onChange={e => setStatut(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB',
                  borderRadius: '10px', fontSize: '15px', color: '#1A1A2E',
                  background: '#fff', cursor: 'pointer', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = '#6C3BFF')}
                onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
              >
                {STATUTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {statut === 'ae' && (
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px', marginBottom: 0 }}>
                  <Info size={11} style={{ display: 'inline', marginRight: '4px' }} />
                  Exonération de CFE si CA ≤ 5 000 € (art. 1447-0 CGI)
                </p>
              )}
            </div>

            {/* CA */}
            <div>
              <label style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px',
              }}>
                <span>Chiffre d&apos;affaires annuel</span>
                <span style={{
                  background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontWeight: 800, fontSize: '16px',
                }}>
                  {fmtCA(ca)}
                </span>
              </label>
              <input
                type="range" min={0} max={100}
                value={sliderPct}
                style={{ width: '100%', marginBottom: '12px', '--range-percent': `${sliderPct}%` } as React.CSSProperties}
                onChange={e => {
                  const pct = parseFloat(e.target.value) / 100
                  const log = (v: number) => Math.log10(Math.max(v, 1))
                  const val = Math.round(Math.pow(10, log(1) + pct * (log(10_000_000) - log(1))))
                  setCa(val); setCaInput(String(val))
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {CA_PRESETS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => { setCa(p.value); setCaInput(String(p.value)) }}
                    style={{
                      padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      border: ca === p.value ? '1.5px solid #6C3BFF' : '1.5px solid #E5E7EB',
                      background: ca === p.value ? '#EDE9FF' : '#F9FAFB',
                      color: ca === p.value ? '#5B21B6' : '#6B7280',
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Saisir :</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                  <input
                    type="text" value={caInput}
                    onChange={e => handleCAChange(e.target.value)}
                    style={{ padding: '6px 10px', border: 'none', outline: 'none', fontSize: '14px', width: '100px', color: '#1A1A2E' }}
                  />
                  <span style={{ padding: '0 10px', background: '#F9FAFB', fontSize: '13px', color: '#6B7280', borderLeft: '1px solid #E5E7EB', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>€</span>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            style={{
              width: '100%', marginTop: '24px', padding: '15px',
              background: canCalculate ? 'linear-gradient(135deg, #6C3BFF, #8B5CF6)' : '#D1D5DB',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: canCalculate ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: canCalculate ? '0 4px 16px rgba(108, 59, 255, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Calculator size={18} />
            {loadingTaux ? 'Chargement du taux...' : 'Calculer ma CFE'}
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ── Results ── */}
        {step === 'results' && results && commune && (
          <div ref={resultsRef} className="animate-fadeInUp" style={{ marginTop: '24px' }}>

            {results.exempt ? (
              <div style={{
                background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '16px',
                padding: '32px', textAlign: 'center',
              }}>
                <CheckCircle2 size={32} color="#16A34A" style={{ marginBottom: '8px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#15803D', marginBottom: '8px' }}>
                  Vous êtes exonéré de CFE !
                </h3>
                <p style={{ color: '#166534', fontSize: '14px', margin: 0 }}>
                  En tant qu&apos;auto-entrepreneur avec un CA ≤ 5 000 €, vous bénéficiez d&apos;une
                  exonération totale de CFE (article 1447-0 du CGI).
                </p>
              </div>
            ) : !results.exempt && (
              <>
                {/* Taux comparison banner */}
                <div style={{
                  display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '13px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    flex: 1, padding: '10px 16px', borderRadius: '10px',
                    background: '#F9FAFB', border: '1px solid #E5E7EB',
                    display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px',
                  }}>
                    <MapPin size={14} color="#6B7280" />
                    <span style={{ color: '#374151' }}>Taux {commune.nom} : <strong>{communeTaux!.taux.toFixed(2)}%</strong></span>
                  </div>
                  <div style={{
                    flex: 1, padding: '10px 16px', borderRadius: '10px',
                    background: '#F5F3FF', border: '1px solid #DDD6FE',
                    display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px',
                  }}>
                    <Sparkles size={14} color="#6C3BFF" />
                    <span style={{ color: '#5B21B6' }}>Taux Paris : <strong>{parisTaux!.taux.toFixed(2)}%</strong></span>
                  </div>
                </div>

                {/* Current vs Paris */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    background: commune.code === PARIS_CODE ? '#F0FDF4' : '#FEF9F0',
                    border: `1px solid ${commune.code === PARIS_CODE ? '#86EFAC' : '#FDE68A'}`,
                    borderRadius: '16px', padding: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <MapPin size={16} color="#6B7280" />
                      <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Votre situation actuelle</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px', fontWeight: 600 }}>
                      {commune.nom} ({commune.codeDepartement})
                    </div>
                    <div className="animate-countUp" style={{
                      fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
                      color: commune.code === PARIS_CODE ? '#15803D' : '#92400E', lineHeight: 1.1,
                    }}>
                      {fmt(results.userMax)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      CFE estimée (plafond légal × {communeTaux!.taux.toFixed(2)}%)
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(145deg, #F5F3FF, #EDE9FF)',
                    border: '2px solid #7C3AED', borderRadius: '16px', padding: '24px',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
                      color: '#fff', fontSize: '10px', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '99px',
                    }}>LegalPlace</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Sparkles size={16} color="#6C3BFF" />
                      <span style={{ fontSize: '13px', color: '#5B21B6', fontWeight: 500 }}>Domiciliation Paris</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px', fontWeight: 600 }}>
                      Paris (75)
                    </div>
                    <div className="animate-countUp" style={{
                      fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
                      color: '#5B21B6', lineHeight: 1.1,
                    }}>
                      {fmt(results.parisMax)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px' }}>
                      CFE estimée (plafond légal × {parisTaux!.taux.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                {/* Savings */}
                {results.isCheaper ? (
                  <div className="animate-countUp" style={{
                    background: 'linear-gradient(135deg, #6C3BFF, #7C3AED)',
                    borderRadius: '16px', padding: '28px 32px',
                    textAlign: 'center', color: '#fff', marginBottom: '16px',
                  }}>
                    <TrendingDown size={28} style={{ marginBottom: '8px', opacity: 0.9 }} />
                    <div style={{ fontSize: '14px', opacity: 0.85, marginBottom: '4px' }}>
                      Économie annuelle estimée avec une domiciliation LegalPlace Paris
                    </div>
                    <div style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, lineHeight: 1.1 }}>
                      {fmt(results.savingsMax)} / an
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '6px' }}>
                      soit {fmt(Math.round(results.savingsMax / 12))} économisés par mois sur votre CFE
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '16px',
                    padding: '20px', textAlign: 'center', marginBottom: '16px',
                  }}>
                    <CheckCircle2 size={24} color="#16A34A" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#15803D', fontWeight: 600, margin: 0 }}>
                      {commune.code === PARIS_CODE
                        ? 'Vous êtes déjà à Paris — vous bénéficiez déjà des taux les plus compétitifs !'
                        : 'Votre commune a un taux compétitif. La domiciliation Paris reste avantageuse pour votre image.'}
                    </p>
                  </div>
                )}

                {/* Data methodology */}
                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: '12px', padding: '16px', marginBottom: '16px',
                  fontSize: '12px', color: '#92400E', lineHeight: 1.6,
                }}>
                  <strong>Méthodologie :</strong> Le taux CFE est le taux officiel voté par la commune,
                  récupéré depuis les données ouvertes DGFiP. L&apos;estimation de la CFE minimum est calculée
                  en appliquant ce taux au <strong>plafond légal de la base minimum</strong> fixé par
                  l&apos;article 1647 D du CGI (barème 2026). Le montant réel peut être inférieur si votre
                  commune a voté une base en dessous du plafond légal.
                </div>

                {/* CTA */}
                <div style={{
                  background: 'linear-gradient(145deg, #F5F3FF, #EDE9FF)',
                  border: '2px solid #7C3AED', borderRadius: '20px',
                  padding: '32px', textAlign: 'center',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
                    color: '#fff', padding: '4px 14px', borderRadius: '99px',
                    fontSize: '12px', fontWeight: 700, marginBottom: '16px',
                  }}>
                    <Star size={12} /> Adresse Paris 2ème — Rue Vivienne
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px' }}>
                    Domiciliez votre entreprise à Paris
                    {results.isCheaper ? ` et économisez ${fmt(results.savingsMax)}/an` : ''}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
                    Dès <strong>19 €/mois</strong>, bénéficiez d&apos;une adresse prestigieuse,
                    de la gestion de votre courrier, et des taux CFE les plus compétitifs de France.
                  </p>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '8px', marginBottom: '24px', textAlign: 'left',
                  }}>
                    {[
                      'Adresse prestigieuse Paris 2ème',
                      'Anonymisation de votre adresse personnelle',
                      'Scan & réception du courrier inclus',
                      'CFE parmi les moins chères de France',
                      'Attestation de domiciliation rapide',
                      'Résiliable à tout moment',
                    ].map(b => (
                      <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#374151' }}>
                        <CheckCircle2 size={14} color="#6C3BFF" style={{ marginTop: '1px', flexShrink: 0 }} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://www.legalplace.fr/domiciliation/"
                    target="_blank" rel="noopener noreferrer"
                    className="animate-pulse-cta"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #6C3BFF, #8B5CF6)',
                      color: '#fff', padding: '15px 32px', borderRadius: '12px',
                      fontSize: '16px', fontWeight: 700, textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(108, 59, 255, 0.4)',
                    }}
                  >
                    Démarrer ma domiciliation <ArrowRight size={18} />
                  </a>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '12px' }}>
                    Sans engagement · Résiliable à tout moment
                  </p>
                </div>
              </>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => { setStep('form'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  background: 'none', border: '1px solid #D1D5DB', borderRadius: '8px',
                  padding: '8px 18px', fontSize: '13px', color: '#6B7280', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                <Calculator size={13} /> Modifier ma simulation
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#F9FAFB', padding: '64px 24px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#1A1A2E' }}>
            Tout savoir sur la CFE et la domiciliation
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px', fontSize: '15px' }}>
            Les questions les plus fréquentes de nos clients
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              {
                q: "Qu'est-ce que la CFE ?",
                a: "La Cotisation Foncière des Entreprises (CFE) est une taxe locale due par toutes les entreprises et personnes physiques exerçant une activité professionnelle non salariée. Son montant dépend de la valeur locative des biens immobiliers utilisés et du taux voté par la commune. En cas de domiciliation (sans locaux propres), vous payez la cotisation minimale : base minimum × taux communal.",
              },
              {
                q: "Comment est calculée la CFE pour une domiciliation ?",
                a: "Pour les entreprises domiciliées (sans locaux propres), la CFE est calculée sur la base minimum fixée par la commune, dans les limites prévues par l'article 1647 D du CGI. Le montant final = base minimum × taux global CFE de la commune. Les taux sont votés chaque année par les collectivités locales.",
              },
              {
                q: "D'où viennent les taux utilisés dans ce simulateur ?",
                a: "Les taux CFE sont récupérés en temps réel depuis les données ouvertes de la DGFiP (Direction Générale des Finances Publiques), publiées sur data.economie.gouv.fr et data.ofgl.fr. Ce sont les taux officiels votés par les communes.",
              },
              {
                q: "Suis-je exonéré de CFE la première année ?",
                a: "Oui ! L'année de création de votre entreprise, vous êtes exonéré de CFE. Les auto-entrepreneurs avec un CA inférieur à 5 000 € bénéficient également d'une exonération permanente (article 1447-0 du CGI).",
              },
              {
                q: "Combien coûte la domiciliation LegalPlace à Paris ?",
                a: "À partir de 19 €/mois, vous bénéficiez d'une adresse dans le 2ème arrondissement de Paris (Rue Vivienne), de la gestion de votre courrier et de tous les avantages d'une domiciliation professionnelle. Résiliable à tout moment.",
              },
            ].map(({ q, a }) => (
              <FAQItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        padding: '64px 24px', background: 'linear-gradient(135deg, #1A1A2E, #2D1B69)',
        color: '#fff', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <Sparkles size={32} color="#A78BFA" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
            Prêt à réduire votre CFE ?
          </h2>
          <p style={{ color: '#A78BFA', marginBottom: '28px', fontSize: '15px', lineHeight: 1.6 }}>
            Rejoignez plus de 40 000 entrepreneurs qui font confiance à LegalPlace
            pour leur domiciliation à Paris.
          </p>
          <a
            href="https://www.legalplace.fr/domiciliation/"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
              color: '#fff', padding: '15px 32px', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(108, 59, 255, 0.5)',
            }}>
            Domicilier mon entreprise à Paris <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px', borderTop: '1px solid #E5E7EB',
        textAlign: 'center', fontSize: '11px', color: '#9CA3AF', lineHeight: 1.6,
      }}>
        <p style={{ maxWidth: '700px', margin: '0 auto 8px' }}>
          <strong>Sources des données :</strong> Taux CFE officiels — DGFiP via data.economie.gouv.fr et data.ofgl.fr.
          Barème de la base minimum — Article 1647 D du CGI. Communes — API Découpage Administratif (geo.api.gouv.fr).
          Les montants affichés sont des estimations calculées à partir du plafond légal de la base minimum et du taux
          officiel voté. Le montant réel de votre CFE peut varier selon la base effectivement votée par votre commune.
          Ce simulateur ne constitue pas un conseil fiscal.
        </p>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} LegalPlace. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
