import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { TrendingUp, Globe, Bell, Users, Plus, RefreshCw } from 'lucide-react'

// Demo data for when no real user is logged in
const DEMO_SITES = [
  { id: '1', url: 'monsite.fr', keywords: ['logiciel CRM', 'gestion relation client'], currentScore: 72, previousScore: 65, lastAudit: new Date().toISOString() },
  { id: '2', url: 'maboutique.fr', keywords: ['e-commerce mode', 'vêtements femme'], currentScore: 48, previousScore: 55, lastAudit: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() },
]

const DEMO_ALERTS = [
  { id: '1', site: 'maboutique.fr', type: 'score_drop', message: 'Score en baisse de 7 points', date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), severity: 'warning' },
  { id: '2', site: 'monsite.fr', type: 'score_up', message: 'Score en hausse de 7 points cette semaine', date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), severity: 'success' },
]

export default async function DashboardPage() {
  // In production, this would check auth and load real data
  // For now, we show a demo dashboard
  const sites = DEMO_SITES
  const alerts = DEMO_ALERTS

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
          Tableau de bord GEO
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Surveillez votre présence dans les réponses IA
        </p>
      </div>

      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Sites suivis', value: sites.length.toString(), icon: Globe, color: '#3B82F6' },
          { label: 'Score moyen', value: `${Math.round(sites.reduce((a, s) => a + s.currentScore, 0) / sites.length)}/100`, icon: TrendingUp, color: '#22c55e' },
          { label: 'Alertes actives', value: alerts.length.toString(), icon: Bell, color: '#f59e0b' },
          { label: 'Concurrents', value: '2/3', icon: Users, color: '#a855f7' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.75rem', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ height: '1.25rem', width: '1.25rem', color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Sites overview */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Mes Sites</h2>
          <Link href="/dashboard/sites" style={{ color: '#3B82F6', fontSize: '0.875rem', textDecoration: 'none' }}>
            Voir tout →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sites.map(site => {
            const diff = site.currentScore - site.previousScore
            const scoreColor = site.currentScore >= 70 ? '#22c55e' : site.currentScore >= 40 ? '#f59e0b' : '#ef4444'
            return (
              <div key={site.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '0.75rem' }}>
                <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', background: '#1e293b', border: `2px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: scoreColor }}>{site.currentScore}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{site.url}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{site.keywords.join(', ')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: diff >= 0 ? '#22c55e' : '#ef4444' }}>
                    {diff >= 0 ? '+' : ''}{diff}
                  </span>
                  <button style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.375rem 0.75rem', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <RefreshCw style={{ height: '0.75rem', width: '0.75rem' }} />
                    Re-audit
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <Link href="/dashboard/sites"
          style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px dashed #334155', borderRadius: '0.75rem', color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>
          <Plus style={{ height: '1rem', width: '1rem' }} />
          Ajouter un site
        </Link>
      </div>

      {/* Recent Alerts */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Alertes récentes</h2>
          <Link href="/dashboard/alerts" style={{ color: '#3B82F6', fontSize: '0.875rem', textDecoration: 'none' }}>
            Voir tout →
          </Link>
        </div>

        {alerts.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            Aucune alerte pour le moment
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: '#0f172a', borderRadius: '0.75rem', borderLeft: `3px solid ${alert.severity === 'warning' ? '#f59e0b' : '#22c55e'}` }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>{alert.message}</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    {alert.site} • {new Date(alert.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
