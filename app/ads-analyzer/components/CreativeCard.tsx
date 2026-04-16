'use client'

import { useState } from 'react'
import type { Creative, CreativeAnalysis } from '../types'
import { Eye, Heart, MessageCircle, Share2, TrendingUp, Sparkles, ExternalLink, Loader2 } from 'lucide-react'

export default function CreativeCard({
  creative,
  onAnalyze,
}: {
  creative: Creative
  onAnalyze: (c: Creative) => void
}) {
  const [analyzing, setAnalyzing] = useState(false)

  const platformColor = creative.platform === 'meta' ? '#1877F2' : '#000000'
  const platformLabel = creative.platform === 'meta' ? 'Meta' : 'TikTok'

  const formatNumber = (n?: number) => {
    if (!n) return '-'
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
  }

  return (
    <div
      style={{
        border: '1px solid var(--lp-border)',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Header: Platform + Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--lp-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              background: platformColor,
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {platformLabel}
          </span>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--lp-text)' }}>
            {creative.brand_name}
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 20,
            background: creative.is_active ? '#DCFCE7' : '#FEE2E2',
            color: creative.is_active ? '#16A34A' : '#DC2626',
            fontWeight: 500,
          }}
        >
          {creative.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Media preview */}
      <div
        style={{
          height: 200,
          background: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {creative.media_url ? (
          <img
            src={creative.media_url}
            alt={creative.headline || 'Creative'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <BrandPlaceholder name={creative.brand_name} headline={creative.headline} platform={creative.platform} />
        )}
        {creative.video_url && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            VIDEO
          </div>
        )}
      </div>

      {/* Body text */}
      <div style={{ padding: '12px 14px' }}>
        {creative.headline && (
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              margin: '0 0 4px',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {creative.headline}
          </p>
        )}
        {creative.body_text && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--lp-muted)',
              margin: 0,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {creative.body_text}
          </p>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderTop: '1px solid var(--lp-border)',
          padding: '8px 0',
        }}
      >
        {creative.platform === 'tiktok' ? (
          <>
            <Stat icon={<Eye size={13} />} value={formatNumber(creative.views)} label="Vues" />
            <Stat icon={<Heart size={13} />} value={formatNumber(creative.likes)} label="Likes" />
            <Stat icon={<MessageCircle size={13} />} value={formatNumber(creative.comments)} label="Com." />
            <Stat icon={<Share2 size={13} />} value={formatNumber(creative.shares)} label="Partages" />
          </>
        ) : (
          <>
            <Stat
              icon={<Eye size={13} />}
              value={
                creative.impressions_lower
                  ? `${formatNumber(creative.impressions_lower)}-${formatNumber(creative.impressions_upper)}`
                  : '-'
              }
              label="Impr."
            />
            <Stat
              icon={<TrendingUp size={13} />}
              value={
                creative.spend_lower
                  ? `${formatNumber(creative.spend_lower)}-${formatNumber(creative.spend_upper)}€`
                  : '-'
              }
              label="Spend"
            />
            <Stat icon={<Eye size={13} />} value={creative.languages?.[0] || '-'} label="Langue" />
            <Stat
              icon={<TrendingUp size={13} />}
              value={creative.start_date ? new Date(creative.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '-'}
              label="Depuis"
            />
          </>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 14px',
          borderTop: '1px solid var(--lp-border)',
        }}
      >
        <button
          onClick={() => onAnalyze(creative)}
          disabled={analyzing}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 12px',
            background: 'var(--lp-purple)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Analyser
        </button>
        {(creative.media_url || creative.landing_page_url) && (
          <a
            href={creative.landing_page_url || creative.media_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              background: 'var(--lp-bg)',
              border: '1px solid var(--lp-border)',
              borderRadius: 8,
              color: 'var(--lp-text)',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

const BRAND_COLORS: Record<string, [string, string]> = {
  hellofresh: ['#91C11E', '#1D8649'],
  nike: ['#111111', '#FA5400'],
  sephora: ['#000000', '#D4002A'],
  dyson: ['#6236FF', '#1A0A3E'],
  duolingo: ['#58CC02', '#1CB0F6'],
  revolut: ['#0075EB', '#191C1F'],
  gymshark: ['#1A1A2E', '#6C3BFF'],
  airbnb: ['#FF385C', '#BD1E59'],
  amazon: ['#FF9900', '#232F3E'],
  notion: ['#000000', '#EEEEEE'],
}

function getBrandGradient(name: string): string {
  const key = name.toLowerCase().replace(/\s/g, '')
  const colors = BRAND_COLORS[key]
  if (colors) return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
  // Generate a consistent color from the brand name
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `linear-gradient(135deg, hsl(${h}, 70%, 50%), hsl(${(h + 40) % 360}, 60%, 35%))`
}

function BrandPlaceholder({ name, headline, platform }: { name: string; headline?: string; platform: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: getBrandGradient(name),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 8,
          backdropFilter: 'blur(4px)',
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{name}</div>
      {headline && (
        <div
          style={{
            fontSize: 11,
            opacity: 0.8,
            lineHeight: 1.3,
            maxWidth: '90%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {headline}
        </div>
      )}
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          color: 'var(--lp-text)',
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {icon}
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--lp-muted)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
