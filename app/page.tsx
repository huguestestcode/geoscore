'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, CheckCircle2, Lock, ArrowRight, Star, TrendingUp, Search, Bot } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ url: '', email: '', keyword1: '', keyword2: '' })
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      setProgress("Initialisation de l'audit...")
      const res = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors du lancement de l'audit")
      }

      const { auditId } = await res.json()

      const steps = [
        'Analyse de votre site web...',
        'Interrogation de ChatGPT...',
        'Interrogation de Perplexity...',
        'Interrogation de Gemini...',
        'Calcul de votre score GEO...',
        'Génération des recommandations...',
        'Création du rapport PDF...',
        "Envoi de l'email...",
      ]
      let stepIndex = 0
      const interval = setInterval(() => {
        if (stepIndex < steps.length - 1) { stepIndex++; setProgress(steps[stepIndex]) }
      }, 5000)

      let attempts = 0
      while (attempts < 40) {
        await new Promise(r => setTimeout(r, 3000))
        attempts++
        const statusRes = await fetch(`/api/audit/status/${auditId}`)
        const { status } = await statusRes.json()
        if (status === 'completed') { clearInterval(interval); router.push(`/results/${auditId}`); return }
        if (status === 'error') { clearInterval(interval); throw new Error("L'audit a échoué. Veuillez réessayer.") }
      }
      clearInterval(interval)
      throw new Error("L'audit a expiré. Veuillez réessayer.")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
      setProgress(null)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: '#0F172A' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e293b', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>GEOscore</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#pricing" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Tarifs</a>
            <a href="/dashboard" style={{ background: '#3B82F6', color: 'white', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none' }}>Dashboard</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1rem 4rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem' }}>
          <Bot style={{ height: '1rem', width: '1rem' }} />
          Nouvelle ère du SEO : Generative Engine Optimization
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Découvrez si <span style={{ background: 'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ChatGPT, Perplexity</span> et Gemini citent votre site
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', maxWidth: '42rem', margin: '0 auto 3rem', lineHeight: 1.7 }}>
          L'IA remplace Google pour des millions de recherches. Mesurez votre visibilité et obtenez un plan d'action personnalisé.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', marginBottom: '4rem' }}>
          {[['40%', "des recherches passent par l'IA"], ['15', 'recommandations personnalisées'], ['3', 'LLMs testés simultanément']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3B82F6' }}>{val}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          {loading ? (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', border: '4px solid #1e293b', borderTop: '4px solid #3B82F6', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Audit en cours...</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{progress}</p>
              <div style={{ background: '#0f172a', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#3B82F6', height: '100%', width: '70%', borderRadius: '9999px', animation: 'pulse 2s ease-in-out infinite' }} />
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
              <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '1rem' }}>L'audit prend environ 30-45 secondes</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '2rem', textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>🚀 Lancez votre audit GEO gratuit</h2>
              {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.875rem' }}>{error}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'url', label: 'URL de votre site *', type: 'url', placeholder: 'https://monsite.fr' },
                  { key: 'email', label: 'Email (pour recevoir vos résultats) *', type: 'email', placeholder: 'vous@exemple.fr' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.375rem' }}>{label}</label>
                    <input type={type} required placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[['keyword1', 'Mot-clé 1 *', 'ex: logiciel CRM'], ['keyword2', 'Mot-clé 2 *', 'ex: gestion client']].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.375rem' }}>{label}</label>
                      <input type="text" required placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <button type="submit" style={{ width: '100%', background: '#3B82F6', color: 'white', fontWeight: 700, padding: '1rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  Lancer mon audit gratuit <ArrowRight style={{ height: '1.25rem', width: '1.25rem' }} />
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>Gratuit • Résultats en 30-45 secondes • Sans carte bancaire</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Tarifs transparents</h2>
          <p style={{ color: '#94a3b8' }}>Commencez gratuitement, payez seulement si vous voulez plus</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '56rem', margin: '0 auto' }}>
          {[
            { title: 'Audit Gratuit', price: '0€', sub: 'Pour découvrir votre score', features: ['Score GEO global /100', 'Résumé des citations LLM', '3 recommandations critiques', 'Rapport PDF (version floue)', '1 audit par email / 24h'], cta: 'Commencer gratuitement', highlight: false },
            { title: 'Rapport Complet', price: '49€', sub: 'Paiement unique, accès à vie', features: ['Tout de l\'offre gratuite', 'Tableau LLM complet (9 tests)', '15 recommandations détaillées', 'Rapport PDF complet', 'Checklist on-page complète', 'Livré par email'], cta: 'Obtenir le rapport complet', highlight: true },
            { title: 'Dashboard Pro', price: '99€/mois', sub: 'Monitoring continu', features: ['Tout du rapport complet', 'Dashboard de suivi hebdomadaire', 'Alertes de baisse de score', 'Tracking concurrents (x3)', 'Re-audit automatique le lundi', 'Historique des scores'], cta: 'Démarrer l\'essai', highlight: false },
          ].map(plan => (
            <div key={plan.title} style={{ background: plan.highlight ? '#2563EB' : '#1e293b', border: `1px solid ${plan.highlight ? '#3B82F6' : '#334155'}`, borderRadius: '1rem', padding: '1.5rem', position: 'relative' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#93c5fd', color: '#1e3a8a', fontSize: '0.75rem', fontWeight: 700, padding: '2px 12px', borderRadius: '9999px' }}>POPULAIRE</div>}
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{plan.title}</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>{plan.price}</div>
              <p style={{ color: plan.highlight ? '#bfdbfe' : '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{plan.sub}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: plan.highlight ? '#dbeafe' : '#cbd5e1' }}>
                    <CheckCircle2 style={{ height: '1rem', width: '1rem', color: plan.highlight ? '#93c5fd' : '#22c55e', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.highlight ? '#' : plan.title === 'Dashboard Pro' ? '/dashboard' : '#'} onClick={plan.title !== 'Dashboard Pro' ? (e) => { e.preventDefault(); document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' }) } : undefined}
                style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: plan.highlight ? 'white' : '#334155', color: plan.highlight ? '#1d4ed8' : 'white', textAlign: 'center', fontWeight: 600, textDecoration: 'none', boxSizing: 'border-box' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.5rem', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ height: '1rem', width: '1rem', color: 'white' }} />
            </div>
            <span style={{ color: 'white', fontWeight: 700 }}>GEOscore</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>© {new Date().getFullYear()} GEOscore. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
