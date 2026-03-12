'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react'

const DEMO_MY_SITE = { url: 'monsite.fr', score: 72, llm_mentions: 4 }
const DEMO_COMPETITORS = [
  { id: '1', url: 'concurrent1.fr', score: 85, llm_mentions: 7, keywords: ['logiciel CRM', 'gestion client'] },
  { id: '2', url: 'concurrent2.fr', score: 58, llm_mentions: 3, keywords: ['logiciel CRM', 'SaaS'] },
]

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(DEMO_COMPETITORS)
  const [showAdd, setShowAdd] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState('')

  const handleAdd = () => {
    if (!newCompetitor) return
    setCompetitors(prev => [...prev, {
      id: Date.now().toString(),
      url: newCompetitor,
      score: 0,
      llm_mentions: 0,
      keywords: [],
    }])
    setNewCompetitor('')
    setShowAdd(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Concurrents</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Comparez votre score GEO avec vos concurrents</p>
        </div>
        {competitors.length < 3 && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
            <Plus style={{ height: '1rem', width: '1rem' }} />
            Ajouter concurrent ({competitors.length}/3)
          </button>
        )}
      </div>

      {showAdd && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <input type="url" placeholder="https://concurrent.fr" value={newCompetitor} onChange={e => setNewCompetitor(e.target.value)}
            style={{ flex: 1, padding: '0.625rem 0.875rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none' }} />
          <button onClick={handleAdd} style={{ background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>Ajouter</button>
          <button onClick={() => setShowAdd(false)} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', cursor: 'pointer' }}>Annuler</button>
        </div>
      )}

      {/* Comparison table */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Comparaison des scores</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Site', 'Score GEO', 'Citations LLM', 'Vs vous'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* My site */}
              <tr style={{ borderBottom: '1px solid #334155', background: 'rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>VOUS</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>{DEMO_MY_SITE.url}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: DEMO_MY_SITE.score >= 70 ? '#22c55e' : '#f59e0b' }}>{DEMO_MY_SITE.score}</span>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>/100</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>{DEMO_MY_SITE.llm_mentions}/9</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>—</td>
              </tr>

              {/* Competitors */}
              {competitors.map(comp => {
                const diff = comp.score - DEMO_MY_SITE.score
                return (
                  <tr key={comp.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'white' }}>{comp.url}</span>
                        <button onClick={() => setCompetitors(prev => prev.filter(c => c.id !== comp.id))}
                          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}>
                          <Trash2 style={{ height: '0.875rem', width: '0.875rem' }} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {comp.score > 0 ? (
                        <>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: comp.score >= 70 ? '#22c55e' : comp.score >= 40 ? '#f59e0b' : '#ef4444' }}>{comp.score}</span>
                          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>/100</span>
                        </>
                      ) : <span style={{ color: '#64748b', fontSize: '0.875rem' }}>En attente...</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ color: '#94a3b8' }}>{comp.llm_mentions > 0 ? `${comp.llm_mentions}/9` : '—'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {comp.score > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: diff > 0 ? '#ef4444' : '#22c55e' }}>
                          {diff > 0 ? <TrendingUp style={{ height: '1rem', width: '1rem' }} /> : <TrendingDown style={{ height: '1rem', width: '1rem' }} />}
                          {diff > 0 ? `${comp.url} vous dépasse de ${diff} pts` : `Vous le dépassez de ${Math.abs(diff)} pts`}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Who cites competitors but not you */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          Opportunités LLM manquées
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Ces LLMs citent vos concurrents mais pas votre site
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { llm: 'ChatGPT', competitor: 'concurrent1.fr', query: 'meilleur logiciel CRM pour PME' },
            { llm: 'Gemini', competitor: 'concurrent1.fr', query: 'top outils gestion relation client' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: '#0f172a', borderRadius: '0.75rem' }}>
              <XCircle style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>{item.llm}</span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}> cite </span>
                <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>{item.competitor}</span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}> pour "</span>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{item.query}</span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>"</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
