import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { runFullAudit } from '@/lib/audit-engine'
import { generateAndStorePDF } from '@/lib/pdf-generator'
import { sendAuditResultEmail } from '@/lib/email-templates'

export const maxDuration = 300 // 5 minutes for Vercel

export async function POST(req: NextRequest) {
  try {
    const { url, email, keyword1, keyword2 } = await req.json()

    // Validation
    if (!url || !email || !keyword1 || !keyword2) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    // Rate limit: max 1 free audit per email per 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentAudit } = await supabaseAdmin
      .from('audits')
      .select('id')
      .eq('email', email)
      .eq('tier', 'free')
      .gte('created_at', oneDayAgo)
      .single()

    if (recentAudit) {
      return NextResponse.json(
        { error: 'Vous avez déjà effectué un audit gratuit dans les dernières 24h. Revenez demain ou débloquez un rapport complet.' },
        { status: 429 }
      )
    }

    // Create audit record with pending status
    const { data: audit, error: insertError } = await supabaseAdmin
      .from('audits')
      .insert({
        url: normalizedUrl,
        email,
        keywords: [keyword1, keyword2],
        tier: 'free',
        status: 'running',
        score: null,
      })
      .select()
      .single()

    if (insertError || !audit) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    // Run audit asynchronously (fire-and-forget pattern)
    runAuditAsync(audit.id, normalizedUrl, email, keyword1, keyword2)

    return NextResponse.json({ auditId: audit.id })

  } catch (error) {
    console.error('Audit run error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

async function runAuditAsync(
  auditId: string,
  url: string,
  email: string,
  keyword1: string,
  keyword2: string
) {
  try {
    // Run the full audit
    const results = await runFullAudit(url, email, keyword1, keyword2)

    // Update audit with results
    await supabaseAdmin
      .from('audits')
      .update({
        score: results.score,
        llm_results: results.llm_results,
        onpage_results: results.onpage_results,
        recommendations: results.recommendations,
        scores: results.scores,
        status: 'completed',
      })
      .eq('id', auditId)

    // Get updated audit for PDF
    const { data: updatedAudit } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (updatedAudit) {
      // Generate blurred PDF
      const pdfUrl = await generateAndStorePDF(updatedAudit, true)
      if (pdfUrl) {
        await supabaseAdmin.from('audits').update({ pdf_url: pdfUrl }).eq('id', auditId)
      }

      // Send result email
      try {
        await sendAuditResultEmail(email, url, results.score, auditId, 'free')
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

  } catch (error) {
    console.error('Async audit error:', error)
    await supabaseAdmin
      .from('audits')
      .update({ status: 'error', error_message: String(error) })
      .eq('id', auditId)
  }
}
