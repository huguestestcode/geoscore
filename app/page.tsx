'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Building2, MapPin, TrendingDown, Calculator,
  CheckCircle2, ArrowRight, Info, ChevronDown,
  Sparkles, Shield, Clock, Star
} from 'lucide-react'

// ─── CFE Data 2024 ────────────────────────────────────────────────────────────
// Cotisations minimales estimées par tranche de CA (domiciliation / siège social uniquement)
// Tranches : ≤10K | 10-32.6K | 32.6-100K | 100-250K | 250-500K | >500K
// Source : délibérations municipales, données Service-Public.fr (estimations indicatives)

type CityData = { id: string; name: string; rates: number[] }

const CITIES: CityData[] = [
  { id: 'paris',       name: 'Paris (75)',                rates: [226,  226,  481,  962,  1443, 1923] },
  { id: 'neuilly',     name: 'Neuilly-sur-Seine (92)',    rates: [652,  843,  1465, 2930, 4395, 5860] },
  { id: 'levallois',   name: 'Levallois-Perret (92)',     rates: [589,  761,  1323, 2646, 3969, 5292] },
  { id: 'boulogne',    name: 'Boulogne-Billancourt (92)', rates: [542,  700,  1217, 2434, 3651, 4868] },
  { id: 'versailles',  name: 'Versailles (78)',           rates: [498,  644,  1119, 2238, 3357, 4476] },
  { id: 'lyon',        name: 'Lyon (69)',                 rates: [388,  501,  871,  1742, 2613, 3484] },
  { id: 'marseille',   name: 'Marseille (13)',            rates: [356,  460,  800,  1600, 2400, 3200] },
  { id: 'toulouse',    name: 'Toulouse (31)',             rates: [374,  484,  841,  1682, 2523, 3364] },
  { id: 'bordeaux',    name: 'Bordeaux (33)',             rates: [412,  532,  925,  1850, 2775, 3700] },
  { id: 'nantes',      name: 'Nantes (44)',               rates: [362,  468,  813,  1626, 2439, 3252] },
  { id: 'lille',       name: 'Lille (59)',                rates: [428,  553,  961,  1922, 2883, 3844] },
  { id: 'nice',        name: 'Nice (06)',                 rates: [395,  511,  888,  1776, 2664, 3552] },
  { id: 'strasbourg',  name: 'Strasbourg (67)',           rates: [408,  527,  916,  1832, 2748, 3664] },
  { id: 'montpellier', name: 'Montpellier (34)',          rates: [376,  486,  845,  1690, 2535, 3380] },
  { id: 'rennes',      name: 'Rennes (35)',               rates: [358,  463,  805,  1610, 2415, 3220] },
  { id: 'grenoble',    name: 'Grenoble (38)',             rates: [392,  507,  882,  1764, 2646, 3528] },
  { id: 'aix',         name: 'Aix-en-Provence (13)',     rates: [418,  540,  939,  1878, 2817, 3756] },
  { id: 'dijon',       name: 'Dijon (21)',                rates: [378,  489,  850,  1700, 2550, 3400] },
  { id: 'nimes',       name: 'Nîmes (30)',                rates: [368,  476,  828,  1656, 2484, 3312] },
  { id: 'toulon',      name: 'Toulon (83)',               rates: [364,  471,  819,  1638, 2457, 3276] },
  { id: 'angers',      name: 'Angers (49)',               rates: [342,  442,  769,  1538, 2307, 3076] },
  { id: 'reims',       name: 'Reims (51)',                rates: [369,  477,  830,  1660, 2490, 3320] },
  { id: 'le_havre',    name: 'Le Havre (76)',             rates: [372,  481,  836,  1672, 2508, 3344] },
  { id: 'rouen',       name: 'Rouen (76)',                rates: [374,  484,  841,  1682, 2523, 3364] },
  { id: 'amiens',      name: 'Amiens (80)',               rates: [381,  492,  856,  1712, 2568, 3424] },
  { id: 'clermont',    name: 'Clermont-Ferrand (63)',     rates: [366,  473,  823,  1646, 2469, 3292] },
  { id: 'metz',        name: 'Metz (57)',                 rates: [383,  495,  860,  1720, 2580, 3440] },
  { id: 'nancy',       name: 'Nancy (54)',                rates: [379,  490,  852,  1704, 2556, 3408] },
  { id: 'orleans',     name: "Orléans (45)",              rates: [357,  462,  803,  1606, 2409, 3212] },
  { id: 'brest',       name: 'Brest (29)',                rates: [348,  450,  783,  1566, 2349, 3132] },
  { id: 'limoges',     name: 'Limoges (87)',              rates: [352,  455,  791,  1582, 2373, 3164] },
  { id: 'tours',       name: 'Tours (37)',                rates: [347,  449,  781,  1562, 2343, 3124] },
  { id: 'autre',       name: 'Autre ville / commune',     rates: [420,  543,  945,  1890, 2835, 3780] },
]

const PARIS = CITIES.find(c => c.id === 'paris')!

const STATUTS = [
  { id: 'ae',   name: 'Auto-entrepreneur / Micro-entreprise' },
  { id: 'eurl', name: 'EURL' },
  { id: 'sarl', name: 'SARL' },
  { id: 'sas',  name: 'SAS' },
  { id: 'sasu', name: 'SASU' },
  { id: 'sa',   name: 'SA' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCFETranche(ca: number): number {
  if (ca <= 10000)  return 0
  if (ca <= 32600)  return 1
  if (ca <= 100000) return 2
  if (ca <= 250000) return 3
  if (ca <= 500000) return 4
  return 5
}

function getCFE(city: CityData, ca: number): number {
  return city.rates[getCFETranche(ca)]
}

function isExempt(statut: string, ca: number): boolean {
  return statut === 'ae' && ca <= 5000
}

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n)
}

function fmtCA(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`
  if (n >= 1_000)     return `${Math.round(n / 1_000)} K€`
  return `${n} €`
}

// ─── SavingsBar ───────────────────────────────────────────────────────────────
function SavingsBar({ label, amount, maxAmount, isLegalPlace = false }: {
  label: string; amount: number; maxAmount: number; isLegalPlace?: boolean
}) {
  const pct = Math.round((amount / maxAmount) * 100)
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
        <div
          className="bar-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '4px',
            background: isLegalPlace
              ? 'linear-gradient(90deg, #6C3BFF, #A78BFA)'
              : '#D1D5DB',
          }}
        />
      </div>
    </div>
  )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid #E5E7EB', borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: open ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '18px 20px', background: '#fff',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E' }}>{question}</span>
        <ChevronDown
          size={18} color="#6B7280"
          style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
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
  const [step, setStep]       = useState<'form' | 'results'>('form')
  const [statut, setStatut]   = useState('sas')
  const [ca, setCa]           = useState(50000)
  const [caInput, setCaInput] = useState('50000')
  const [cityId, setCityId]   = useState('')
  const resultsRef            = useRef<HTMLDivElement>(null)

  const city = useMemo(() => CITIES.find(c => c.id === cityId) || null, [cityId])

  const results = useMemo(() => {
    if (!city) return null
    const exempt     = isExempt(statut, ca)
    const cfeCurrent = exempt ? 0 : getCFE(city, ca)
    const cfeParis   = exempt ? 0 : getCFE(PARIS, ca)
    const savings    = cfeCurrent - cfeParis
    const isCheaper  = savings > 0
    return { cfeCurrent, cfeParis, savings, isCheaper, exempt }
  }, [city, statut, ca])

  const compCities = useMemo(() => {
    const tranche = getCFETranche(ca)
    return CITIES
      .filter(c => c.id !== 'autre')
      .map(c => ({ id: c.id, name: c.name.split(' (')[0], amount: c.rates[tranche] }))
      .sort((a, b) => b.amount - a.amount)
  }, [ca])

  const maxCompAmount = useMemo(() => Math.max(...compCities.map(c => c.amount)), [compCities])

  function handleCalculate() {
    if (!city || !results) return
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

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

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
          target="_blank"
          rel="noopener noreferrer"
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
              Simulateur CFE 2024 — Gratuit
            </span>
          </div>
          <h1 className="animate-fadeInUp delay-100" style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
            lineHeight: 1.15, color: '#1A1A2E', marginBottom: '16px',
          }}>
            Combien payez-vous de CFE ?<br />
            <span style={{ color: '#6C3BFF' }}>Comparez avec Paris.</span>
          </h1>
          <p className="animate-fadeInUp delay-200" style={{
            fontSize: '17px', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px',
          }}>
            La Cotisation Foncière des Entreprises varie fortement selon votre commune.
            Découvrez en 30 secondes si une domiciliation à Paris vous fait économiser.
          </p>
          <div className="animate-fadeInUp delay-300" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px',
          }}>
            {[
              { icon: <CheckCircle2 size={15} />, text: '100% gratuit' },
              { icon: <Clock size={15} />, text: 'Résultat immédiat' },
              { icon: <Shield size={15} />, text: 'Sans engagement' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: '#6B7280',
              }}>
                <span style={{ color: '#22C55E' }}>{icon}</span>
                {text}
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
              Tous les champs sont obligatoires pour estimer votre CFE
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>

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
                {STATUTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
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
                  setCa(val)
                  setCaInput(String(val))
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
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Saisir manuellement :</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                  <input
                    type="text"
                    value={caInput}
                    onChange={e => handleCAChange(e.target.value)}
                    style={{ padding: '6px 10px', border: 'none', outline: 'none', fontSize: '14px', width: '100px', color: '#1A1A2E' }}
                  />
                  <span style={{ padding: '0 10px', background: '#F9FAFB', fontSize: '13px', color: '#6B7280', borderLeft: '1px solid #E5E7EB', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>€</span>
                </div>
              </div>
            </div>

            {/* Ville */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Ville actuelle du siège social
              </label>
              <select
                value={cityId}
                onChange={e => setCityId(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB',
                  borderRadius: '10px', fontSize: '15px',
                  color: cityId ? '#1A1A2E' : '#9CA3AF',
                  background: '#fff', cursor: 'pointer', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = '#6C3BFF')}
                onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
              >
                <option value="" disabled>Choisir votre ville...</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={handleCalculate}
            disabled={!city}
            style={{
              width: '100%', marginTop: '24px', padding: '15px',
              background: city ? 'linear-gradient(135deg, #6C3BFF, #8B5CF6)' : '#D1D5DB',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: city ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: city ? '0 4px 16px rgba(108, 59, 255, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Calculator size={18} />
            Calculer ma CFE
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ── Results ── */}
        {step === 'results' && results && city && (
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
            ) : (
              <>
                {/* Current vs Paris */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    background: cityId === 'paris' ? '#F0FDF4' : '#FEF9F0',
                    border: `1px solid ${cityId === 'paris' ? '#86EFAC' : '#FDE68A'}`,
                    borderRadius: '16px', padding: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <MapPin size={16} color="#6B7280" />
                      <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Votre situation actuelle</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px', fontWeight: 600 }}>
                      {city.name.split(' (')[0]}
                    </div>
                    <div className="animate-countUp" style={{
                      fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
                      color: cityId === 'paris' ? '#15803D' : '#92400E', lineHeight: 1.1,
                    }}>
                      {fmt(results.cfeCurrent)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>CFE annuelle estimée</div>
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
                    }}>
                      LegalPlace
                    </div>
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
                      {fmt(results.cfeParis)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px' }}>CFE annuelle estimée</div>
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
                      {fmt(results.savings)} / an
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '6px' }}>
                      soit {fmt(Math.round(results.savings / 12))} économisés par mois sur votre CFE
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '16px',
                    padding: '20px', textAlign: 'center', marginBottom: '16px',
                  }}>
                    <CheckCircle2 size={24} color="#16A34A" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#15803D', fontWeight: 600, margin: 0 }}>
                      {cityId === 'paris'
                        ? 'Vous êtes déjà à Paris — vous bénéficiez déjà des taux les plus compétitifs !'
                        : 'Votre commune a des taux compétitifs. La domiciliation Paris reste avantageuse pour votre image.'}
                    </p>
                  </div>
                )}

                {/* Comparison chart */}
                <div style={{
                  background: '#fff', border: '1px solid #E5E7EB',
                  borderRadius: '16px', padding: '24px', marginBottom: '16px',
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>
                    Comparaison — CFE minimales des principales villes françaises
                  </h3>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '20px' }}>
                    Pour un CA de {fmtCA(ca)} — domiciliation uniquement (estimations 2024)
                  </p>
                  {compCities.map(c => (
                    <SavingsBar
                      key={c.id}
                      label={c.name}
                      amount={c.amount}
                      maxAmount={maxCompAmount}
                      isLegalPlace={c.id === 'paris'}
                    />
                  ))}
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
                    <Star size={12} />
                    Adresse Paris 8ème — Champs-Élysées
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px' }}>
                    Domiciliez votre entreprise à Paris
                    {results.isCheaper ? ` et économisez ${fmt(results.savings)}/an` : ''}
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
                      'Adresse Paris 8ème',
                      'Gestion du courrier incluse',
                      'CFE parmi les moins chères de France',
                      'Accès espace de coworking',
                      'Résiliation à tout moment',
                      'Attestation de domiciliation rapide',
                    ].map(b => (
                      <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#374151' }}>
                        <CheckCircle2 size={14} color="#6C3BFF" style={{ marginTop: '1px', flexShrink: 0 }} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://www.legalplace.fr/domiciliation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animate-pulse-cta"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #6C3BFF, #8B5CF6)',
                      color: '#fff', padding: '15px 32px', borderRadius: '12px',
                      fontSize: '16px', fontWeight: 700, textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(108, 59, 255, 0.4)',
                    }}
                  >
                    Démarrer ma domiciliation
                    <ArrowRight size={18} />
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
                }}
              >
                <Calculator size={13} /> Modifier ma simulation
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Info section ── */}
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
                a: "La Cotisation Foncière des Entreprises (CFE) est une taxe locale due par toutes les entreprises et personnes physiques exerçant une activité professionnelle non salariée. Son montant dépend de la valeur locative des biens immobiliers utilisés pour l'activité et du taux voté par chaque commune. En cas de domiciliation (sans locaux propres), vous payez la cotisation minimale fixée par votre commune.",
              },
              {
                q: "Pourquoi la CFE est-elle moins chère à Paris ?",
                a: "Paris a voté des montants de cotisation minimale inférieurs à de nombreuses autres villes françaises, notamment les communes du 92 (Hauts-de-Seine) comme Neuilly ou Boulogne-Billancourt. Pour une entreprise domiciliée sans locaux propres, la différence peut représenter plusieurs centaines, voire milliers d'euros par an.",
              },
              {
                q: "Comment fonctionne la domiciliation pour la CFE ?",
                a: "Lorsque vous domiciliez votre entreprise chez LegalPlace à Paris, votre siège social est à l'adresse parisienne. C'est donc la commune de Paris qui fixe votre CFE. Vous payez la cotisation minimale parisienne, généralement plus avantageuse que dans les communes périphériques ou certaines grandes villes de province.",
              },
              {
                q: "Suis-je exonéré de CFE la première année ?",
                a: "Oui ! L'année de création de votre entreprise, vous êtes exonéré de CFE. Les auto-entrepreneurs avec un CA inférieur à 5 000 € bénéficient également d'une exonération permanente (article 1447-0 du CGI).",
              },
              {
                q: "Combien coûte la domiciliation LegalPlace à Paris ?",
                a: "À partir de 19 €/mois, vous bénéficiez d'une adresse dans le 8ème arrondissement de Paris (Champs-Élysées), de la gestion de votre courrier et de tous les avantages d'une domiciliation professionnelle. La domiciliation est résiliable à tout moment.",
              },
            ].map(({ q, a }) => (
              <FAQItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        padding: '64px 24px',
        background: 'linear-gradient(135deg, #1A1A2E, #2D1B69)',
        color: '#fff', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <Sparkles size={32} color="#A78BFA" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
            Prêt à réduire votre CFE ?
          </h2>
          <p style={{ color: '#A78BFA', marginBottom: '28px', fontSize: '15px', lineHeight: 1.6 }}>
            Rejoignez plus de 200 000 entrepreneurs qui font confiance à LegalPlace
            pour leur domiciliation à Paris.
          </p>
          <a
            href="https://www.legalplace.fr/domiciliation/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6C3BFF, #A78BFA)',
              color: '#fff', padding: '15px 32px', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(108, 59, 255, 0.5)',
            }}
          >
            Domicilier mon entreprise à Paris
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px', borderTop: '1px solid #E5E7EB',
        textAlign: 'center', fontSize: '11px', color: '#9CA3AF', lineHeight: 1.6,
      }}>
        <p style={{ maxWidth: '700px', margin: '0 auto 8px' }}>
          <strong>Avertissement :</strong> Les montants de CFE présentés sont des estimations basées sur les délibérations
          municipales connues et peuvent varier selon les années et les communes. Ce simulateur est fourni à titre indicatif
          uniquement et ne constitue pas un conseil fiscal. Consultez l&apos;administration fiscale ou un expert-comptable
          pour connaître votre CFE exacte.
        </p>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} LegalPlace. Tous droits réservés.</p>
      </footer>

    </div>
  )
}
