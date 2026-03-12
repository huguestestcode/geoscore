'use client'

import { useState } from 'react'
import { CreditCard, Bell, User, ExternalLink, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [emailFrequency, setEmailFrequency] = useState<'weekly' | 'daily'>('weekly')
  const [notifications, setNotifications] = useState({
    score_drop: true,
    citation_lost: true,
    competitor_overtook: true,
    score_up: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '56rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Paramètres</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Gérez votre abonnement et vos préférences</p>
      </div>

      {/* Subscription */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <CreditCard style={{ height: '1.25rem', width: '1.25rem', color: '#3B82F6' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Abonnement</h2>
        </div>

        <div style={{ background: '#0f172a', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: 'white' }}>Dashboard Pro</span>
              <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>ACTIF</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>99€/mois • Renouvellement le 9 avril 2026</p>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3B82F6' }}>99€</div>
        </div>

        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#334155', color: '#94a3b8', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ExternalLink style={{ height: '1rem', width: '1rem' }} />
          Gérer l'abonnement (Portail Stripe)
        </a>
      </div>

      {/* Notifications */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Bell style={{ height: '1.25rem', width: '1.25rem', color: '#3B82F6' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Alertes email</h2>
        </div>

        {/* Email frequency */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.75rem' }}>
            Fréquence des emails de rapport
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { value: 'weekly', label: 'Hebdomadaire', sub: 'Rapport chaque lundi' },
              { value: 'daily', label: 'Quotidien', sub: 'Rapport chaque jour' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setEmailFrequency(opt.value as any)}
                style={{ flex: 1, padding: '0.875rem', borderRadius: '0.75rem', border: `2px solid ${emailFrequency === opt.value ? '#3B82F6' : '#334155'}`, background: emailFrequency === opt.value ? 'rgba(59,130,246,0.1)' : '#0f172a', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: emailFrequency === opt.value ? '#60a5fa' : 'white', fontSize: '0.875rem' }}>{opt.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notification types */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.75rem' }}>
            Types d'alertes
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { key: 'score_drop', label: 'Baisse de score > 10 points', color: '#ef4444' },
              { key: 'citation_lost', label: 'Disparition des réponses d\'un LLM', color: '#f59e0b' },
              { key: 'competitor_overtook', label: 'Un concurrent vous dépasse', color: '#f97316' },
              { key: 'score_up', label: 'Amélioration du score', color: '#22c55e' },
            ].map(notif => (
              <div key={notif.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: '#0f172a', borderRadius: '0.75rem' }}
                onClick={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key as keyof typeof prev] }))}>
                <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{notif.label}</span>
                <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: (notifications as any)[notif.key] ? '#3B82F6' : '#334155', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: (notifications as any)[notif.key] ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <User style={{ height: '1.25rem', width: '1.25rem', color: '#3B82F6' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Compte</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '0.75rem' }}>
          <div style={{ height: '3rem', width: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem', flexShrink: 0 }}>
            U
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>utilisateur@exemple.fr</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Abonné depuis le 9 mars 2026</p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} style={{ background: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {saved ? (
          <>
            <CheckCircle2 style={{ height: '1.125rem', width: '1.125rem' }} />
            Paramètres sauvegardés !
          </>
        ) : 'Sauvegarder les paramètres'}
      </button>
    </div>
  )
}
