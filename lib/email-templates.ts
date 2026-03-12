import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendAuditResultEmail(
  email: string,
  url: string,
  score: number,
  auditId: string,
  tier: 'free' | 'paid' = 'free'
) {
  const isUnlocked = tier === 'paid'
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  const scoreLabel = score >= 70 ? 'Excellent' : score >= 40 ? 'À améliorer' : 'Critique'

  await resend.emails.send({
    from: 'GEOscore <noreply@geoscore.io>',
    to: email,
    subject: `Votre audit GEO pour ${url} — Score: ${score}/100`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: Inter, system-ui, sans-serif; background: #0F172A; color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px 32px; text-align: center; border-bottom: 1px solid #334155;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #3B82F6;">GEOscore</h1>
      <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Generative Engine Optimization Audit</p>
    </div>

    <!-- Score Section -->
    <div style="padding: 40px 32px; text-align: center;">
      <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Votre GEOscore</p>
      <div style="display: inline-block; background: #0f172a; border-radius: 50%; width: 120px; height: 120px; line-height: 120px; text-align: center; margin: 16px auto; border: 4px solid ${scoreColor};">
        <span style="font-size: 42px; font-weight: 800; color: ${scoreColor};">${score}</span>
      </div>
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${scoreColor};">${scoreLabel}</p>
      <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">pour <strong style="color: #e2e8f0;">${url}</strong></p>
    </div>

    <!-- Info box -->
    <div style="margin: 0 32px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
      <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Votre audit GEO est prêt. Découvrez dans quelle mesure ChatGPT, Perplexity et Gemini citent votre site, et obtenez vos recommandations personnalisées pour améliorer votre visibilité dans les réponses des IA.
      </p>
    </div>

    <!-- CTA -->
    <div style="padding: 32px; text-align: center;">
      <a href="${APP_URL}/results/${auditId}" style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 16px;">
        Voir mes résultats →
      </a>

      ${!isUnlocked ? `
      <div style="margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; border: 1px solid #3B82F6;">
        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #f8fafc;">🔓 Débloquez le rapport complet</p>
        <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px;">Accédez aux 15 recommandations détaillées, au tableau complet des citations LLM, et téléchargez votre rapport PDF complet.</p>
        <a href="${APP_URL}/results/${auditId}" style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Débloquer pour 49€ →
        </a>
      </div>
      ` : `
      <div style="margin-top: 16px;">
        <a href="${APP_URL}/results/${auditId}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Télécharger le rapport PDF complet →
        </a>
      </div>
      `}
    </div>

    <!-- Footer -->
    <div style="padding: 24px 32px; border-top: 1px solid #334155; text-align: center;">
      <p style="margin: 0; color: #64748b; font-size: 12px;">
        GEOscore — Optimisez votre présence dans l'IA<br>
        <a href="${APP_URL}" style="color: #3B82F6;">geoscore.io</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
  })
}

export async function sendFullReportEmail(
  email: string,
  url: string,
  score: number,
  auditId: string,
  pdfUrl: string | null
) {
  await resend.emails.send({
    from: 'GEOscore <noreply@geoscore.io>',
    to: email,
    subject: `✅ Rapport GEO complet débloqué — ${url}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #0F172A; color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    <div style="padding: 40px 32px; text-align: center;">
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 800; color: #3B82F6;">GEOscore</h1>
      <div style="margin: 24px 0; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #10b981;">
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #10b981;">✅ Rapport complet débloqué !</p>
        <p style="margin: 8px 0 0; color: #94a3b8;">Score: ${score}/100 pour ${url}</p>
      </div>
      <a href="${APP_URL}/results/${auditId}?unlocked=true" style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0;">
        Accéder au rapport complet →
      </a>
      ${pdfUrl ? `<br><a href="${pdfUrl}" style="display: inline-block; background: #475569; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 8px;">Télécharger le PDF →</a>` : ''}
    </div>
  </div>
</body>
</html>
    `,
  })
}

export async function sendAlertEmail(
  email: string,
  url: string,
  oldScore: number,
  newScore: number,
  dashboardUrl: string
) {
  const drop = oldScore - newScore
  await resend.emails.send({
    from: 'GEOscore <noreply@geoscore.io>',
    to: email,
    subject: `⚠️ Alerte GEO: Score en baisse de ${drop} points — ${url}`,
    html: `
<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>⚠️ Alerte GEO détectée</h2>
  <p>Le score GEO de <strong>${url}</strong> a baissé de <strong style="color: #ef4444;">${drop} points</strong></p>
  <p>Score précédent: ${oldScore}/100 → Score actuel: <strong>${newScore}/100</strong></p>
  <a href="${dashboardUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Voir le dashboard →</a>
</div>
    `,
  })
}
