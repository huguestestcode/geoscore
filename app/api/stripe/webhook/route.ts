import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { generateAndStorePDF } from '@/lib/pdf-generator'
import { sendFullReportEmail } from '@/lib/email-templates'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { auditId, type, email } = session.metadata || {}

        if (type === 'oneshot' && auditId) {
          // Unlock the report
          await supabaseAdmin
            .from('audits')
            .update({
              tier: 'paid',
              stripe_session_id: session.id,
            })
            .eq('id', auditId)

          // Get audit and generate full PDF
          const { data: audit } = await supabaseAdmin
            .from('audits')
            .select('*')
            .eq('id', auditId)
            .single()

          if (audit) {
            const fullPdfUrl = await generateAndStorePDF(audit, false)
            if (fullPdfUrl) {
              await supabaseAdmin
                .from('audits')
                .update({ pdf_url: fullPdfUrl })
                .eq('id', auditId)
            }

            // Send full report email
            if (email) {
              await sendFullReportEmail(email, audit.url, audit.score, auditId, fullPdfUrl)
            }
          }

        } else if (type === 'saas' && email) {
          // Create or update user account
          const { data: user } = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
          })

          if (user.user && session.customer) {
            // Create subscription record
            await supabaseAdmin.from('subscriptions').upsert({
              user_id: user.user.id,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: 'active',
            })

            // Link audit to user if provided
            if (auditId) {
              await supabaseAdmin
                .from('audits')
                .update({ user_id: user.user.id, tier: 'saas' })
                .eq('id', auditId)
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status === 'active' ? 'active' :
          subscription.status === 'past_due' ? 'past_due' : 'cancelled'
        await supabaseAdmin
          .from('subscriptions')
          .update({ status })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}
