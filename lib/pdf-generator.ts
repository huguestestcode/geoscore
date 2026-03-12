import { Audit } from '@/types'
import { supabaseAdmin } from './supabase'

// Simple HTML-to-PDF approach using data URLs
// In production, replace with Puppeteer or react-pdf

export function generatePDFHtml(audit: Audit, isBlurred: boolean = true): string {
  const scoreColor = audit.score >= 70 ? '#22c55e' : audit.score >= 40 ? '#f59e0b' : '#ef4444'
  const mentionedCount = audit.llm_results?.filter(r => r.mentioned).length || 0
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const recommendationsHtml = (audit.recommendations || []).map((rec, i) => {
    const isVisible = !isBlurred || i < 3
    const priorityColor = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#f59e0b',
      low: '#22c55e',
    }[rec.priority] || '#64748b'

    return `
    <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; ${!isVisible ? 'filter: blur(4px); user-select: none;' : ''}">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="background: ${priorityColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">${rec.priority}</span>
        <span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${rec.category}</span>
      </div>
      <h4 style="margin: 0 0 8px; font-size: 15px; color: #1e293b;">${rec.title}</h4>
      <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; line-height: 1.5;">${rec.description}</p>
      <p style="margin: 0; font-size: 12px; color: #3B82F6; font-weight: 600;">Impact estimé: ${rec.impact}</p>
    </div>
  `
  }).join('')

  const llmTableHtml = (audit.llm_results || []).slice(0, 9).map(r => `
    <tr style="${isBlurred ? 'filter: blur(3px); user-select: none;' : ''}">
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 12px; text-transform: capitalize;">${r.llm}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.prompt.substring(0, 60)}...</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: ${r.mentioned ? '#22c55e' : '#ef4444'};">${r.mentioned ? '✓' : '✗'}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 12px; text-align: center; text-transform: capitalize;">${r.position}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rapport GEO — ${audit.url}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, sans-serif; color: #1e293b; background: white; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 32px; font-weight: 800; color: #0F172A; }
    h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 32px 0 16px; }
    h3 { font-size: 16px; font-weight: 600; color: #1e293b; margin: 24px 0 12px; }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 3px solid #3B82F6; margin-bottom: 40px;">
    <h1 style="color: #3B82F6; font-size: 36px; margin-bottom: 8px;">GEOscore</h1>
    <p style="color: #64748b; font-size: 14px;">Rapport d'Audit Generative Engine Optimization</p>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 8px;">Généré le ${new Date().toLocaleDateString('fr-FR')} pour ${audit.url}</p>
  </div>

  <!-- Global Score -->
  <div style="text-align: center; padding: 40px; background: #f8fafc; border-radius: 16px; margin-bottom: 40px; border: 2px solid ${scoreColor};">
    <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Score GEO Global</p>
    <div style="font-size: 80px; font-weight: 900; color: ${scoreColor}; line-height: 1;">${audit.score}</div>
    <div style="font-size: 24px; color: #94a3b8; margin-top: 8px;">/100</div>
    <p style="margin-top: 16px; color: #64748b;">Votre site est cité dans <strong>${mentionedCount}/9</strong> réponses IA testées</p>
  </div>

  <!-- Score Breakdown -->
  <h2>Répartition du Score</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px;">
    ${[
      { label: 'Citations LLM', score: audit.scores?.llm_score || 0, max: 40 },
      { label: 'Facteurs On-Page', score: audit.scores?.onpage_score || 0, max: 40 },
      { label: 'Autorité', score: audit.scores?.authority_score || 0, max: 20 },
    ].map(item => `
      <div style="padding: 20px; background: #f8fafc; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; font-weight: 800; color: #3B82F6;">${item.score}</div>
        <div style="font-size: 12px; color: #94a3b8;">/${item.max}</div>
        <div style="font-size: 13px; color: #475569; margin-top: 8px;">${item.label}</div>
      </div>
    `).join('')}
  </div>

  <!-- LLM Results Table -->
  <h2>Résultats des Tests LLM ${isBlurred ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">🔒 Version complète disponible</span>' : ''}</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px;">
    <thead>
      <tr style="background: #f1f5f9;">
        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">LLM</th>
        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Requête</th>
        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">Cité</th>
        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">Position</th>
      </tr>
    </thead>
    <tbody>
      ${llmTableHtml}
    </tbody>
  </table>

  <!-- Recommendations -->
  <h2>Recommandations ${isBlurred ? '(3 sur 15 visibles)' : '(15 recommandations)'}</h2>
  ${recommendationsHtml}

  ${isBlurred ? `
  <!-- Unlock CTA -->
  <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; margin-top: 40px; color: white;">
    <h3 style="font-size: 22px; color: white; margin-bottom: 12px;">🔓 Débloquez le rapport complet</h3>
    <p style="color: #94a3b8; margin-bottom: 24px;">Accédez aux 15 recommandations, au tableau complet des 9 tests LLM, et au rapport PDF complet.</p>
    <div style="font-size: 32px; font-weight: 800; color: #3B82F6; margin-bottom: 16px;">49€ <span style="font-size: 16px; color: #64748b;">paiement unique</span></div>
    <a href="${APP_URL}/results/${audit.id}" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Débloquer maintenant →</a>
  </div>
  ` : ''}

  <!-- Footer -->
  <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
    <p>Rapport généré par GEOscore — ${APP_URL}</p>
    <p style="margin-top: 4px;">© ${new Date().getFullYear()} GEOscore. Tous droits réservés.</p>
  </div>

</div>
</body>
</html>
  `
}

export async function generateAndStorePDF(
  audit: Audit,
  isBlurred: boolean = true
): Promise<string | null> {
  try {
    const html = generatePDFHtml(audit, isBlurred)

    // Store HTML as a "PDF" placeholder in Supabase Storage
    // In production, replace with Puppeteer to generate real PDFs
    const fileName = `audit-${audit.id}-${isBlurred ? 'free' : 'full'}.html`
    const { error } = await supabaseAdmin.storage
      .from('reports')
      .upload(fileName, Buffer.from(html), {
        contentType: 'text/html',
        upsert: true,
      })

    if (error) {
      console.error('Storage error:', error)
      return null
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('reports')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('PDF generation error:', error)
    return null
  }
}
