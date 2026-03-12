'use client'

import { useState } from 'react'
import { Bell, TrendingDown, BotOff, TrendingUp, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

const DEMO_ALERTS = [
  {
    id: '1',
    type: 'score_drop',
    site: 'maboutique.fr',
    message: 'Score GEO en baisse de 7 points',
    detail: 'Votre score est passé de 55 à 48/100 cette semaine. Vérifiez les facteurs on-page et le contenu.',
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    severity: 'critical',
    read: false,
  },
  {
    id: '2',
    type: 'citation_lost',
    site: 'maboutique.fr',
    message: 'Vous avez disparu des réponses Gemini',
    detail: 'Gemini ne cite plus votre site pour les requêtes liées à "e-commerce mode". Cela représente 3/9 tests LLM.',
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    severity: 'warning',
    read: false,
  },
  {
    id: '3',
    type: 'competitor_overtook',
    site: 'monsite.fr',
    message: 'Un concurrent vous a dépassé',
    detail: 'concurrent1.fr a maintenant un score de 85/100 vs votre 72/100. Écart de 13 points.',
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    severity: 'warning',
    read: true,
  },
  {
    id: '4',
    type: 'score_up',
    site: 'monsite.fr',
    message: 'Score en hausse de 7 points 🎉',
    detail: 'Excellent travail ! Votre score est passé de 65 à 72/100 cette semaine. Les ajouts de FAQ Schema ont porté leurs fruits.',
    date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    severity: 'success',
    read: true,
  },
]

const ALERT_ICONS = {
  score_drop: TrendingDown,
  citation_lost: BotOff,
  competitor_overtook: AlertTriangle,
  score_up: TrendingUp,
}

const SEVERITY_COLORS = {
  critical: { bg: '#ef444420', border: '#ef444440', icon: '#ef4444', text: 'Critique' },
  warning: { bg: '#f59e0b20', border: '#f59e0b40', icon: '#f59e0b', text: 'Attention' },
  success: { bg: '#22c55e20', border: '#22c55e40', icon: '#22c55e', text: 'Succès' },
  info: { bg: '#3B82F620', border: '#3B82F640', icon: '#3B82F6', text: 'Info' },
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredAlerts = filter === 'unread' ? alerts.filter(a => !a.read) : alerts
  const unreadCount = alerts.filter(a => !a.read).length

  const markRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Alertes</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Restez informé des changements de votre score GEO</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'all', label: 'Toutes les alertes', count: alerts.length },
          { key: 'unread', label: 'Non lues', count: unreadCount },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key as any)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, background: filter === tab.key ? '#3B82F6' : '#1e293b', color: filter === tab.key ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {tab.label}
            {tab.count > 0 && (
              <span style={{ background: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#334155', borderRadius: '9999px', padding: '1px 8px', fontSize: '0.75rem' }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <Bell style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Aucune alerte {filter === 'unread' ? 'non lue' : ''}</p>
          </div>
        ) : filteredAlerts.map(alert => {
          const Icon = ALERT_ICONS[alert.type as keyof typeof ALERT_ICONS] || Info
          const colors = SEVERITY_COLORS[alert.severity as keyof typeof SEVERITY_COLORS]

          return (
            <div key={alert.id}
              style={{ background: alert.read ? '#1e293b' : colors.bg, border: `1px solid ${alert.read ? '#334155' : colors.border}`, borderRadius: '1rem', padding: '1.25rem 1.5rem', opacity: alert.read ? 0.7 : 1 }}
              onClick={() => markRead(alert.id)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.75rem', background: `${colors.icon}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ height: '1.25rem', width: '1.25rem', color: colors.icon }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>{alert.message}</span>
                    {!alert.read && <span style={{ background: '#3B82F6', borderRadius: '9999px', height: '8px', width: '8px', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{alert.detail}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>{alert.site}</span>
                    <span>•</span>
                    <span>{new Date(alert.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span style={{ color: colors.icon, fontWeight: 600 }}>{colors.text}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
