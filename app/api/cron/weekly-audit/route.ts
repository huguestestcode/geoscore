import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { runFullAudit } from '@/lib/audit-engine'
import { sendAlertEmail } from '@/lib/email-templates'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active SaaS subscribers
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No active subscriptions' })
    }

    const userIds = subscriptions.map(s => s.user_id)

    // Get tracked sites for these users
    const { data: trackedSites } = await supabaseAdmin
      .from('tracked_sites')
      .select('*')
      .in('user_id', userIds)
      .eq('is_competitor', false)

    if (!trackedSites || trackedSites.length === 0) {
      return NextResponse.json({ message: 'No tracked sites' })
    }

    let processed = 0
    let errors = 0

    for (const site of trackedSites) {
      try {
        // 2-second delay to avoid OpenAI rate limits
        await new Promise(r => setTimeout(r, 2000))

        const keywords = site.keywords || ['general', 'service']
        const results = await runFullAudit(
          site.url,
          '', // No email for cron audits
          keywords[0] || 'general',
          keywords[1] || keywords[0] || 'service'
        )

        // Get previous score
        const { data: previousHistory } = await supabaseAdmin
          .from('audit_history')
          .select('score')
          .eq('tracked_site_id', site.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        // Store new history
        await supabaseAdmin.from('audit_history').insert({
          tracked_site_id: site.id,
          score: results.score,
          llm_results: results.llm_results,
          onpage_results: results.onpage_results,
          recommendations: results.recommendations,
        })

        // Check for significant score drop (>10 points)
        if (previousHistory && (previousHistory.score - results.score) > 10) {
          // Get user email
          const { data: user } = await supabaseAdmin.auth.admin.getUserById(site.user_id)
          if (user.user?.email) {
            await sendAlertEmail(
              user.user.email,
              site.url,
              previousHistory.score,
              results.score,
              `${APP_URL}/dashboard`
            )
          }
        }

        processed++
      } catch (siteError) {
        console.error(`Error processing site ${site.url}:`, siteError)
        errors++
      }
    }

    return NextResponse.json({
      message: 'Weekly audit completed',
      processed,
      errors,
      total: trackedSites.length,
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
