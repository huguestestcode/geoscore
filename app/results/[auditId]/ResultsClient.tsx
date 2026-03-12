'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Audit } from '@/types'
import ScoreGauge from '@/components/ScoreGauge'
import BlurredContent from '@/components/BlurredContent'
import RecommendationCard from '@/components/RecommendationCard'
import LLMResultsTable from '@/components/LLMResultsTable'
import { Zap, Download, Lock, CheckCircle2, XCircle, ExternalLink, ArrowLeft } from 'lucide-react'

interface ResultsClientProps {
  audit: Audit
  isUnlocked: boolean
}

export default function ResultsClient({ audit, isUnlocked }: ResultsClientProps) {
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  const mentionedCount = audit.llm_results?.filter(r => r.mentioned).length || 0
  const totalPrompts = audit.llm_results?.length || 9

  const handleCheckout = async (type: 'oneshot' | 'saas') => {
    setCheckoutLoading(type)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId: audit.id, type, email: audit.email }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du paiement')
    } finally {
      setCheckoutLoading(null)
    }
  }

  const scoreColor = audit.score >= 70 ? '#22c55e' : audit.score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ minHeight: '100vh', background: '#0F172A', color: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e293b', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
          Retour
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.5rem', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ height: '1rem', width: '1rem', color: 'white' }} />
          </div>
          <span style={{ fontWeight: 700, color: 'white' }}>GEOscore</span>
        </div>
        {isUnlocked && (
          <span style={{ marginLeft: 'auto', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
            ✓ Rapport complet débloqué
          </span>
        )}
      </nav>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
            Rapport GEO — {audit.url}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Audit réalisé le {new Date(audit.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Score Section */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
          <ScoreGauge score={audit.score || 0} size="lg" animated={true} />

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Score GEO Global
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Citations LLM', score: audit.scores?.llm_score || 0, max: 40 },
                { label: 'On-Page', score: audit.scores?.onpage_score || 0, max: 40 },
                { label: 'Autorité', score: audit.scores?.authority_score || 0, max: 20 },
              ].map(item => (
                <div key={item.label} style={{ background: '#0f172a', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6' }}>{item.score}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>/{item.max}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#0f172a', borderRadius: '0.75rem', border: `1px solid ${scoreColor}30` }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                Votre site est cité dans{' '}
                <strong style={{ color: scoreColor }}>{mentionedCount}/{totalPrompts}</strong>
                {' '}réponses IA testées
              </p>
            </div>
          </div>
        </div>

        {/* LLM Summary (always visible) */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Résumé des citations LLM
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {['chatgpt', 'perplexity', 'gemini'].map(llm => {
              const llmResults = audit.llm_results?.filter(r => r.llm === llm) || []
              const count = llmResults.filter(r => r.mentioned).length
              const colors = { chatgpt: '#22c55e', perplexity: '#3B82F6', gemini: '#a855f7' }
              const color = colors[llm as keyof typeof colors]
              return (
                <div key={llm} style={{ background: '#0f172a', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color }}>{count}/3</div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', textTransform: 'capitalize', marginTop: '0.25rem' }}>{llm}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* LLM Full Results (gated) */}
        {isUnlocked ? (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Résultats détaillés des tests LLM
            </h3>
            <LLMResultsTable results={audit.llm_results || []} />
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Résultats détaillés des tests LLM
            </h3>
            <BlurredContent auditId={audit.id}>
              <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
                <LLMResultsTable results={audit.llm_results?.slice(0, 3) || []} />
              </div>
            </BlurredContent>
          </div>
        )}

        {/* On-page factors (gated) */}
        {isUnlocked ? (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Checklist des facteurs On-Page GEO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(audit.onpage_results || []).map(factor => (
                <div key={factor.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                  {factor.passed ? (
                    <CheckCircle2 style={{ height: '1.25rem', width: '1.25rem', color: '#22c55e', flexShrink: 0 }} />
                  ) : (
                    <XCircle style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '0.875rem', color: factor.passed ? '#cbd5e1' : '#94a3b8' }}>{factor.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748b' }}>+{factor.weight} pts</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Checklist des facteurs On-Page GEO
            </h3>
            <BlurredContent auditId={audit.id} label="Voir la checklist complète — 49€">
              <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(audit.onpage_results || []).slice(0, 3).map(factor => (
                  <div key={factor.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                    <div style={{ height: '1.25rem', width: '1.25rem', borderRadius: '50%', background: factor.passed ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem' }}>{factor.label}</span>
                  </div>
                ))}
              </div>
            </BlurredContent>
          </div>
        )}

        {/* Recommendations */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Recommandations {isUnlocked ? '(15 recommandations)' : '(3 sur 15 visibles)'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* First 3 always visible */}
            {(audit.recommendations || []).slice(0, 3).map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} index={i} />
            ))}
          </div>

          {/* Remaining 12 - gated */}
          {isUnlocked ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              {(audit.recommendations || []).slice(3).map((rec, i) => (
                <RecommendationCard key={i + 3} recommendation={rec} index={i + 3} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: '0.75rem' }}>
              <BlurredContent auditId={audit.id} label="Voir les 12 recommandations restantes — 49€">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.25rem', height: '100px' }} />
                  ))}
                </div>
              </BlurredContent>
            </div>
          )}
        </div>

        {/* PDF Download */}
        {audit.pdf_url && (
          <div style={{ marginBottom: '1.5rem' }}>
            <a href={audit.pdf_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#334155', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
              <Download style={{ height: '1rem', width: '1rem' }} />
              Télécharger le rapport {isUnlocked ? 'complet' : '(version aperçu)'}
            </a>
          </div>
        )}

        {/* Unlock CTAs */}
        {!isUnlocked && (
          <div id="unlock" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3B82F6', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Lock style={{ height: '2.5rem', width: '2.5rem', color: '#3B82F6', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                Débloquez votre rapport complet
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                Accédez aux 15 recommandations, au tableau complet des tests LLM, à la checklist on-page, et téléchargez votre rapport PDF complet.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', maxWidth: '36rem', margin: '0 auto' }}>
              {/* One-shot */}
              <div style={{ background: '#1e293b', border: '2px solid #3B82F6', borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>49€</div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Paiement unique, accès à vie</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  {['15 recommandations détaillées', 'Tableau LLM complet (9 tests)', 'Checklist on-page complète', 'Rapport PDF complet'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <CheckCircle2 style={{ height: '0.875rem', width: '0.875rem', color: '#22c55e', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout('oneshot')}
                  disabled={checkoutLoading !== null}
                  style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  {checkoutLoading === 'oneshot' ? 'Redirection...' : '🔓 Débloquer maintenant'}
                </button>
              </div>

              {/* SaaS */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>99€<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}>/mois</span></div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Dashboard + monitoring continu</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  {['Tout du rapport complet', 'Dashboard de suivi hebdomadaire', 'Alertes baisse de score', 'Tracking concurrents (x3)'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <CheckCircle2 style={{ height: '0.875rem', width: '0.875rem', color: '#22c55e', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout('saas')}
                  disabled={checkoutLoading !== null}
                  style={{ width: '100%', background: '#334155', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  {checkoutLoading === 'saas' ? 'Redirection...' : '📊 Accéder au Dashboard Pro'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
