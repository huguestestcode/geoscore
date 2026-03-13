'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, ArrowRight, CheckCircle2, Lock, Star, Bot, TrendingUp,
  Search, Globe, BarChart3, AlertTriangle, ChevronDown, ChevronUp,
  MessageSquare, Sparkles
} from 'lucide-react'

// ─── Mock preview data ────────────────────────────────────────────────────────
const MOCK_LLM = [
  { llm: 'ChatGPT', icon: '🤖', cited: true, position: '2ème', sentiment: '😊 Positif' },
  { llm: 'Perplexity', icon: '🔍', cited: false, position: '—', sentiment: '—' },
  { llm: 'Gemini', icon: '✨', cited: true, position: 'Mentionné', sentiment: '😐 Neutre' },
]
const MOCK_KEYWORDS = [
  { kw: 'logiciel CRM PME', chatgpt: '2ème', perplexity: 'Non cité', gemini: 'Mentionné' },
  { kw: 'meilleur CRM France', chatgpt: 'Non cité', perplexity: 'Non cité', gemini: '3ème' },
  { kw: 'gestion relation client', chatgpt: 'Non cité', perplexity: 'Non cité', gemini: 'Non cité' },
]
const MOCK_ERRORS = [
  { label: 'FAQ Schema manquant', impact: '+12 pts', priority: 'critical' },
  { label: 'Aucun titre en forme de question', impact: '+8 pts', priority: 'high' },
  { label: 'Pas de page Auteur', impact: '+6 pts', priority: 'high' },
  { label: 'Meta description trop courte', impact: '+5 pts', priority: 'medium' },
]
const MOCK_ACTIONS = [
  'Ajouter un bloc FAQ avec balisage JSON-LD sur la page d\'accueil',
  'Reformuler 3 titres H2 en questions directes ("Comment..." / "Pourquoi...")',
  'Créer une page /auteur avec bio et photo pour renforcer l\'E-E-A-T',
  'Intégrer 5 statistiques chiffrées avec sources dans le contenu principal',
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()

  // Step 1 = URL saisie, Step 2 = email + keywords
  const [step, setStep] = useState<1 | 2>(1)
  const [url, setUrl] = useState('')
  const [form, setForm] = useState({ email: '', keyword1: '', keyword2: '' })
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setProgress('Connexion au serveur...')

    try {
      const res = await fetch('/api/audit/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, ...form }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors du lancement')
      }

      if (!res.body) throw new Error('Pas de flux de données')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'progress') {
              setProgress(data.message)
            } else if (data.type === 'complete') {
              localStorage.setItem(`audit_${data.auditId}`, JSON.stringify(data))
              router.push(`/results/${data.auditId}`)
              return
            } else if (data.type === 'error') {
              throw new Error(data.message || "L'audit a échoué.")
            }
          } catch (parseErr) {
            // ignore malformed lines
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      setLoading(false)
      setProgress(null)
    }
  }

  return (
    <div style={{ background: '#0A0F1E', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>GEOscore</span>
          <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.25)', marginLeft: '4px' }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#how" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Comment ça marche</a>
          <a href="#pricing" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Tarifs</a>
          <a href="/dashboard" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.875rem', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '8px', textDecoration: 'none' }}>Dashboard →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem 3rem', textAlign: 'center' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '0.35rem 1rem 0.35rem 0.5rem', marginBottom: '2rem' }}>
          <span style={{ background: '#6366f1', borderRadius: '100px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>NOUVEAU</span>
          <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>40% des recherches passent maintenant par l'IA</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          Votre site est-il{' '}
          <span style={{ background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            visible dans les réponses IA
          </span>
          {' '}?
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 3rem' }}>
          Testez en 45 secondes si ChatGPT, Perplexity et Gemini citent votre site — et obtenez un plan d'action pour y apparaître.
        </p>

        {/* ─ FORM BOX ─ */}
        <div style={{ maxWidth: '580px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '20px', padding: '2rem' }}>

          {loading ? (
            // Loading state
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTop: '4px solid #6366f1', animation: 'spin 0.9s linear infinite', margin: '0 auto 1.5rem' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Audit en cours…</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{progress}</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#3B82F6,#6366f1)', height: '100%', width: '65%', borderRadius: '100px', animation: 'pulse 2s ease-in-out infinite' }} />
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.75rem' }}>~30-45 secondes • Ne fermez pas cet onglet</p>
            </div>

          ) : step === 1 ? (
            // Step 1: URL only
            <form onSubmit={handleStep1}>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                URL de votre site
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0 1rem', gap: '0.5rem' }}>
                  <Globe size={16} color="#475569" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="monsite.fr"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '1rem', padding: '0.875rem 0' }}
                  />
                </div>
                <button type="submit" style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Analyser <ArrowRight size={16} />
                </button>
              </div>
              <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.75rem', marginTop: '0.875rem' }}>
                ✓ Gratuit &nbsp;·&nbsp; ✓ Sans carte bancaire &nbsp;·&nbsp; ✓ Résultats en 45s
              </p>
            </form>

          ) : (
            // Step 2: email + keywords
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.6rem 0.875rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px' }}>
                <CheckCircle2 size={15} color="#22c55e" />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', flex: 1 }}>{url}</span>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem' }}>Changer</button>
              </div>

              {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Email (pour recevoir les résultats)</label>
                  <input type="email" required placeholder="vous@exemple.fr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[['keyword1', 'Mot-clé 1', 'ex: logiciel CRM'], ['keyword2', 'Mot-clé 2', 'ex: gestion client']].map(([k, l, p]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{l}</label>
                      <input type="text" required placeholder={p} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                        style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <button type="submit" style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Sparkles size={18} /> Lancer l'audit gratuit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Social proof strip */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {[['🧑‍💼', '1 200+ audits réalisés'], ['⭐', '4.9/5 satisfaction'], ['⚡', 'Résultats en 45s']].map(([emoji, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.85rem' }}>
              <span>{emoji}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MOCK REPORT PREVIEW ── */}
      <section id="how" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Voici ce que vous obtenez en 45 secondes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Aperçu d'un vrai rapport GEOscore — résultats partiellement masqués en version gratuite</p>
        </div>

        {/* Mock report card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden' }}>

          {/* Report header */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" />
              </div>
              <span style={{ fontWeight: 700, color: 'white' }}>GEOscore — Rapport d'audit</span>
            </div>
            <span style={{ color: '#475569', fontSize: '0.8rem' }}>monsite.fr • {new Date().toLocaleDateString('fr-FR')}</span>
          </div>

          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem' }}>

            {/* ─ Score global ─ */}
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Score GEO Global</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Gauge mock */}
                <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray={`${2*Math.PI*48}`} strokeDashoffset={`${2*Math.PI*48*(1-0.52)}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>52</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/100</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[['Citations LLM', 18, 40, '#f59e0b'], ['On-Page GEO', 24, 40, '#3B82F6'], ['Autorité', 10, 20, '#a855f7']].map(([l, v, max, c]) => (
                    <div key={l as string}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#94a3b8' }}>{l as string}</span>
                        <span style={{ color: c as string, fontWeight: 700 }}>{v as number}/{max as number}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '100px', height: '5px' }}>
                        <div style={{ background: c as string, width: `${(v as number)/(max as number)*100}%`, height: '100%', borderRadius: '100px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─ LLM positions ─ */}
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                Positionnement par LLM
                <span style={{ marginLeft: '0.5rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '6px' }}>3/9 cités</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {MOCK_LLM.map(row => (
                  <div key={row.llm} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{row.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white', width: '80px' }}>{row.llm}</span>
                    <span style={{ flex: 1, fontSize: '0.8rem', color: row.cited ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                      {row.cited ? `✓ ${row.position}` : '✗ Non cité'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.sentiment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─ Keywords table ─ */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Positions par mot-clé
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    {['Requête testée', 'ChatGPT 🤖', 'Perplexity 🔍', 'Gemini ✨'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.625rem 1rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_KEYWORDS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontStyle: 'italic' }}>"{row.kw}"</td>
                      {[row.chatgpt, row.perplexity, row.gemini].map((v, j) => (
                        <td key={j} style={{ padding: '0.75rem 1rem', color: v === 'Non cité' ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─ Errors + Actions (blurred) ─ */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>

            {/* Errors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Erreurs détectées <span style={{ color: '#ef4444' }}>(4)</span>
                </h3>
                <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>PAYANT</span>
              </div>
              <div style={{ position: 'relative' }}>
                {/* Visible item */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={15} color="#ef4444" />
                  <span style={{ flex: 1, fontSize: '0.875rem', color: '#fca5a5' }}>FAQ Schema manquant</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>+12 pts</span>
                </div>
                {/* Blurred items */}
                <div style={{ position: 'relative' }}>
                  <div style={{ filter: 'blur(5px)', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {MOCK_ERRORS.slice(1).map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(239,68,68,0.06)', borderRadius: '10px' }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: '#fca5a5' }}>{e.label}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>{e.impact}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lock size={13} color="#818cf8" />
                      <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>Débloquer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Plan d'action <span style={{ color: '#3B82F6' }}>(15 actions)</span>
                </h3>
                <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.2)' }}>PAYANT</span>
              </div>
              <div style={{ position: 'relative' }}>
                {/* Visible first action */}
                <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '10px', marginBottom: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '5px', flexShrink: 0, marginTop: '2px' }}>CRITIQUE</span>
                  <span style={{ fontSize: '0.8rem', color: '#93c5fd', lineHeight: 1.5 }}>Ajouter un bloc FAQ avec balisage JSON-LD</span>
                </div>
                {/* Blurred rest */}
                <div style={{ position: 'relative' }}>
                  <div style={{ filter: 'blur(5px)', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {MOCK_ACTIONS.slice(1).map((a, i) => (
                      <div key={i} style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.06)', borderRadius: '10px', fontSize: '0.8rem', color: '#93c5fd' }}>{a}</div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lock size={13} color="#818cf8" />
                      <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>Débloquer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unlock banner */}
          <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.12))', borderTop: '1px solid rgba(99,102,241,0.2)', padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>🔓 Débloquez toutes les données de votre site</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>15 actions prioritaires · Tableau LLM complet · Checklist on-page · Rapport PDF</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.625rem 1.25rem' }}>
                <div style={{ fontWeight: 800, color: 'white' }}>49€</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>one-shot</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '0.625rem 1.25rem' }}>
                <div style={{ fontWeight: 800, color: '#a5b4fc' }}>99€/mois</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>dashboard + alertes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '3rem' }}>
          Comment fonctionne l'audit ?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '2rem' }}>
          {[
            { n: '01', icon: Globe, title: 'Entrez votre URL', desc: "Collez l'URL de votre site et vos 2 mots-clés principaux.", color: '#3B82F6' },
            { n: '02', icon: MessageSquare, title: 'On teste 3 LLMs', desc: 'GPT-4o, Perplexity et Gemini sont interrogés sur 9 requêtes liées à vos mots-clés.', color: '#6366f1' },
            { n: '03', icon: BarChart3, title: 'Analyse on-page', desc: 'FAQ schema, structure de contenu, autorité, liens — 10 facteurs GEO analysés.', color: '#8b5cf6' },
            { n: '04', icon: Sparkles, title: "Plan d'action IA", desc: 'GPT-4o génère 15 recommandations priorisées et personnalisées pour votre site.', color: '#c084fc' },
          ].map(step => {
            const Icon = step.icon
            return (
              <div key={step.n} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: step.color, background: `${step.color}18`, padding: '3px 8px', borderRadius: '6px' }}>{step.n}</span>
                  <div style={{ background: `${step.color}18`, borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={step.color} />
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Tarifs simples et transparents</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Commencez gratuitement, payez uniquement pour accéder à l'intégralité du rapport</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            {
              name: 'Audit Gratuit', price: '0€', sub: 'Pour découvrir', highlight: false,
              features: ['Score GEO global /100', 'Résumé des 3 LLMs', '1 recommandation critique', 'Rapport PDF (aperçu)', '1 audit / 24h / email'],
              cta: 'Lancer gratuitement', href: '#'
            },
            {
              name: 'Rapport Complet', price: '49€', sub: 'Paiement unique, accès à vie', highlight: true,
              features: ['Tout du gratuit +', 'Tableau LLM complet (9 tests)', '15 recommandations détaillées', 'Checklist on-page (10 facteurs)', 'Rapport PDF complet', 'Livré par email'],
              cta: '→ Débloquer le rapport', href: '#'
            },
            {
              name: 'Dashboard Pro', price: '99€/mois', sub: 'Monitoring continu', highlight: false,
              features: ['Tout du rapport complet +', 'Re-audit automatique chaque lundi', 'Alertes si score baisse', 'Tracking 3 concurrents', 'Historique & graphes', 'Support prioritaire'],
              cta: 'Démarrer le suivi', href: '/dashboard'
            },
          ].map(plan => (
            <div key={plan.name} style={{ background: plan.highlight ? 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.12))' : 'rgba(255,255,255,0.02)', border: `1px solid ${plan.highlight ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '20px', padding: '1.75rem', position: 'relative' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#3B82F6,#6366f1)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '3px 12px', borderRadius: '100px', whiteSpace: 'nowrap' }}>⭐ LE PLUS POPULAIRE</div>}
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: plan.highlight ? '#60a5fa' : 'white', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{plan.price}</div>
              <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{plan.sub}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={15} color={plan.highlight ? '#60a5fa' : '#22c55e'} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} onClick={plan.href === '#' ? (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) } : undefined}
                style={{ display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', background: plan.highlight ? 'linear-gradient(135deg,#3B82F6,#6366f1)' : 'rgba(255,255,255,0.07)', color: 'white', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '2.5rem' }}>Ce qu'en disent nos utilisateurs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
          {[
            { q: "En 3 semaines j'ai appliqué les recommandations et je suis passé de 2/9 à 7/9 citations LLM. Incroyable ROI.", name: 'Thomas L.', role: 'Fondateur SaaS B2B', stars: 5 },
            { q: "Je faisais du SEO depuis 5 ans sans réaliser que Google n'était plus la seule porte d'entrée. GEOscore m'a ouvert les yeux.", name: 'Camille V.', role: 'Consultante SEO', stars: 5 },
            { q: "Le dashboard pro m'alerte chaque semaine si mon score bouge. Je ne peux plus m'en passer pour suivre mes clients.", name: 'Marc D.', role: 'Agence digitale', stars: 5 },
          ].map(t => (
            <div key={t.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                {[...Array(t.stars)].map((_,i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem', fontStyle: 'italic' }}>"{t.q}"</p>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</p>
                <p style={{ color: '#475569', fontSize: '0.8rem' }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '2.5rem' }}>Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { q: "C'est quoi le GEO exactement ?", a: "Le Generative Engine Optimization (GEO) est l'équivalent du SEO pour les IA génératives. Là où le SEO vous positionne dans Google, le GEO vous fait apparaître dans les réponses de ChatGPT, Perplexity et Gemini." },
            { q: "Les tests LLM sont-ils vrais ?", a: "Nous simulons ChatGPT et Gemini via GPT-4o avec des system prompts spécifiques à chaque IA, et Perplexity avec un prompt web-aware. C'est une approximation précise pour l'MVP — les vraies API seront connectées prochainement." },
            { q: "Pourquoi mon site n'est pas cité par les IA ?", a: "Principalement : absence de FAQ Schema, contenu peu structuré, manque de citations externes, pas de réponses directes aux questions dans le contenu. Toutes ces lacunes apparaissent dans votre rapport." },
            { q: "Que contient le rapport payant (49€) ?", a: "Les 15 recommandations prioritaires avec impact estimé, le tableau complet des 9 tests LLM (3 LLMs × 3 requêtes), la checklist on-page des 10 facteurs GEO, et un rapport PDF à télécharger." },
            { q: "L'abonnement peut-il être résilié à tout moment ?", a: "Oui, vous pouvez résilier depuis le dashboard ou via le portail Stripe à tout moment. Aucun engagement, aucun frais de résiliation." },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: '100%', padding: '1.125rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', gap: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9375rem' }}>{item.q}</span>
                {faqOpen === i ? <ChevronUp size={18} color="#64748b" style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color="#64748b" style={{ flexShrink: 0 }} />}
              </button>
              {faqOpen === i && (
                <div style={{ padding: '0 1.5rem 1.125rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ paddingTop: '1rem' }}>{item.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem 6rem', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '24px', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Prêt à découvrir votre score GEO ?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' }}>Gratuit · 45 secondes · Sans carte bancaire</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', color: 'white', border: 'none', borderRadius: '14px', padding: '1rem 2.5rem', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} /> Lancer mon audit gratuit
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg,#3B82F6,#6366f1)', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700 }}>GEOscore</span>
          </div>
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>© {new Date().getFullYear()} GEOscore. Tous droits réservés.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Confidentialité', 'CGU', 'Contact'].map(l => (
              <a key={l} href="#" style={{ color: '#334155', fontSize: '0.8rem', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
