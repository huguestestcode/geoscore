'use client'

import { useState } from 'react'
import { Globe, Plus, RefreshCw, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import ScoreTrend from '@/components/Dashboard/ScoreTrend'

// Demo data
const DEMO_SITES = [
  {
    id: '1', url: 'monsite.fr', keywords: ['logiciel CRM', 'gestion client'],
    currentScore: 72, previousScore: 65,
    lastAudit: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    history: [
      { id: 'h1', tracked_site_id: '1', score: 58, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString() },
      { id: 'h2', tracked_site_id: '1', score: 62, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString() },
      { id: 'h3', tracked_site_id: '1', score: 65, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString() },
      { id: 'h4', tracked_site_id: '1', score: 68, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() },
      { id: 'h5', tracked_site_id: '1', score: 72, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date().toISOString() },
    ],
  },
  {
    id: '2', url: 'maboutique.fr', keywords: ['e-commerce mode', 'vêtements femme'],
    currentScore: 48, previousScore: 55,
    lastAudit: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    history: [
      { id: 'h6', tracked_site_id: '2', score: 60, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString() },
      { id: 'h7', tracked_site_id: '2', score: 57, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString() },
      { id: 'h8', tracked_site_id: '2', score: 55, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString() },
      { id: 'h9', tracked_site_id: '2', score: 55, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() },
      { id: 'h10', tracked_site_id: '2', score: 48, llm_results: [], onpage_results: [], recommendations: [], created_at: new Date().toISOString() },
    ],
  },
]

export default function SitesPage() {
  const [sites, setSites] = useState(DEMO_SITES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSite, setNewSite] = useState({ url: '', keyword1: '', keyword2: '' })
  const [expandedSite, setExpandedSite] = useState<string | null>(null)

  const handleAddSite = () => {
    if (!newSite.url || !newSite.keyword1) return
    setSites(prev => [...prev, {
      id: Date.now().toString(),
      url: newSite.url,
      keywords: [newSite.keyword1, newSite.keyword2].filter(Boolean),
      currentScore: 0,
      previousScore: 0,
      lastAudit: '',
      history: [],
    }])
    setNewSite({ url: '', keyword1: '', keyword2: '' })
    setShowAddForm(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Mes Sites</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Suivez l'évolution de votre score GEO</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
          <Plus style={{ height: '1rem', width: '1rem' }} />
          Ajouter un site
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem' }}>Nouveau site à surveiller</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { key: 'url', label: 'URL du site', placeholder: 'https://monsite.fr' },
              { key: 'keyword1', label: 'Mot-clé principal', placeholder: 'ex: logiciel CRM' },
              { key: 'keyword2', label: 'Mot-clé secondaire', placeholder: 'ex: gestion clients' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.375rem' }}>{label}</label>
                <input type="text" placeholder={placeholder} value={(newSite as any)[key]} onChange={e => setNewSite(n => ({ ...n, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem 0.875rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={handleAddSite} style={{ background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
              Ajouter et lancer l'audit
            </button>
            <button onClick={() => setShowAddForm(false)} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Sites list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sites.map(site => {
          const diff = site.currentScore - site.previousScore
          const scoreColor = site.currentScore >= 70 ? '#22c55e' : site.currentScore >= 40 ? '#f59e0b' : '#ef4444'
          const isExpanded = expandedSite === site.id

          return (
            <div key={site.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setExpandedSite(isExpanded ? null : site.id)}>
                {/* Score circle */}
                <div style={{ height: '3rem', width: '3rem', borderRadius: '50%', background: '#0f172a', border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: scoreColor }}>{site.currentScore || '?'}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe style={{ height: '1rem', width: '1rem', color: '#64748b' }} />
                    <span style={{ fontWeight: 700, color: 'white' }}>{site.url}</span>
                    {site.currentScore > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600, color: diff >= 0 ? '#22c55e' : '#ef4444' }}>
                        {diff >= 0 ? <TrendingUp style={{ height: '0.875rem', width: '0.875rem' }} /> : <TrendingDown style={{ height: '0.875rem', width: '0.875rem' }} />}
                        {diff >= 0 ? '+' : ''}{diff}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {site.keywords.join(' • ')}
                    {site.lastAudit && ` • Dernier audit: ${new Date(site.lastAudit).toLocaleDateString('fr-FR')}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={e => { e.stopPropagation(); alert('Re-audit lancé !') }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }}>
                    <RefreshCw style={{ height: '0.75rem', width: '0.75rem' }} />
                    Re-audit
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSites(prev => prev.filter(s => s.id !== site.id)) }}
                    style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.5rem', color: '#64748b', cursor: 'pointer' }}>
                    <Trash2 style={{ height: '0.875rem', width: '0.875rem' }} />
                  </button>
                </div>
              </div>

              {/* Expanded trend chart */}
              {isExpanded && site.history.length > 0 && (
                <div style={{ borderTop: '1px solid #334155', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Évolution du score GEO
                  </h4>
                  <ScoreTrend history={site.history} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
