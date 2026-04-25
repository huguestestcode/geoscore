'use client'

import { X, Sparkles, Target, FileText, Palette, Award, AlertTriangle, Lightbulb, Copy, Check } from 'lucide-react'
import type { CreativeAnalysis } from '../types'
import { useState } from 'react'

export default function AnalysisModal({
  analysis,
  onClose,
}: {
  analysis: CreativeAnalysis
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyBrief = () => {
    navigator.clipboard.writeText(analysis.reproduction_brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 700,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--lp-border)',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1,
            borderRadius: '16px 16px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="var(--lp-purple)" />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Analyse IA</span>
            <span
              style={{
                background: scoreColor(analysis.overall_score),
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 20,
              }}
            >
              {analysis.overall_score}/100
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--lp-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Hook */}
          <Section icon={<Target size={16} />} title="Hook (Accroche)" color="#F59E0B">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <Tag label={analysis.hook.hook_type} />
              <Tag label={`Attention: ${analysis.hook.attention_score}/10`} color={analysis.hook.attention_score >= 7 ? '#22C55E' : '#F59E0B'} />
              <Tag label={analysis.hook.emotional_trigger} />
            </div>
            <blockquote
              style={{
                margin: 0,
                padding: '8px 12px',
                borderLeft: '3px solid #F59E0B',
                background: '#FFFBEB',
                borderRadius: '0 8px 8px 0',
                fontSize: 14,
                fontStyle: 'italic',
              }}
            >
              &quot;{analysis.hook.hook_text}&quot;
            </blockquote>
          </Section>

          {/* Script */}
          <Section icon={<FileText size={16} />} title="Script & Structure" color="var(--lp-purple)">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <Tag label={`Framework: ${analysis.script.structure}`} color="var(--lp-purple)" />
              <Tag label={`Ton: ${analysis.script.tone}`} />
              <Tag label={`CTA: ${analysis.script.cta_type}`} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {analysis.script.sections.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                  <span
                    style={{
                      minWidth: 80,
                      fontWeight: 600,
                      color: 'var(--lp-purple)',
                      fontSize: 12,
                      paddingTop: 1,
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ color: 'var(--lp-muted)' }}>{s.content}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'var(--lp-purple-light)',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <strong>CTA :</strong> {analysis.script.cta_text}
            </div>
            {analysis.script.persuasion_techniques.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {analysis.script.persuasion_techniques.map((t, i) => (
                  <Tag key={i} label={t} color="#6366F1" />
                ))}
              </div>
            )}
          </Section>

          {/* Visual */}
          <Section icon={<Palette size={16} />} title="Analyse Visuelle" color="#EC4899">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
              <InfoRow label="Format" value={analysis.visual.format} />
              <InfoRow label="Style" value={analysis.visual.visual_style} />
              <InfoRow label="Ratio" value={analysis.visual.aspect_ratio} />
              <InfoRow label="Visage" value={analysis.visual.has_face ? 'Oui' : 'Non'} />
              <InfoRow label="Texte overlay" value={analysis.visual.has_text_overlay ? 'Oui' : 'Non'} />
              <InfoRow
                label="Couleurs"
                value={analysis.visual.dominant_colors.join(', ')}
              />
            </div>
          </Section>

          {/* Strengths & Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Section icon={<Award size={16} />} title="Points forts" color="#22C55E">
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {analysis.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Section>
            <Section icon={<AlertTriangle size={16} />} title="Points faibles" color="#EF4444">
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {analysis.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Recommendations */}
          <Section icon={<Lightbulb size={16} />} title="Recommandations" color="#F59E0B">
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {analysis.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>

          {/* Reproduction Brief */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--lp-purple-light), #F0EAFF)',
              borderRadius: 12,
              padding: 16,
              border: '1px solid var(--lp-purple)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--lp-purple)' }}>
                Brief de reproduction
              </span>
              <button
                onClick={copyBrief}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  background: 'var(--lp-purple)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copie !' : 'Copier'}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--lp-text)', whiteSpace: 'pre-wrap' }}>
              {analysis.reproduction_brief}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Tag({ label, color = 'var(--lp-muted)' }: { label: string; color?: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 6,
        border: `1px solid ${color}33`,
        background: `${color}11`,
        color,
      }}
    >
      {label}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--lp-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 60) return '#F59E0B'
  return '#EF4444'
}
