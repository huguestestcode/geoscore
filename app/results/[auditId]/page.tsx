'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Audit } from '@/types'
import ResultsClient from './ResultsClient'

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const auditId = params.auditId as string
  const isUnlocked = searchParams.get('unlocked') === 'true'

  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auditId) return
    try {
      const stored = localStorage.getItem(`audit_${auditId}`)
      if (stored) {
        setAudit(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false)
  }, [auditId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTop: '4px solid #6366f1', animation: 'spin 0.9s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p>Chargement du rapport...</p>
        </div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
        <p style={{ fontSize: '1.1rem' }}>Rapport introuvable.</p>
        <a href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.875rem' }}>← Lancer un nouvel audit</a>
      </div>
    )
  }

  return <ResultsClient audit={audit} isUnlocked={isUnlocked} />
}
