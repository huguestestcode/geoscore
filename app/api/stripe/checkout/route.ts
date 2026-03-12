import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ONESHOT, STRIPE_PRICE_SAAS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { auditId, type, email } = await req.json()

    if (type === 'oneshot') {
      // One-shot 49€ payment
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price: STRIPE_PRICE_ONESHOT,
            quantity: 1,
          },
        ],
        metadata: {
          auditId,
          type: 'oneshot',
          email,
        },
        success_url: `${APP_URL}/results/${auditId}?unlocked=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/results/${auditId}`,
      })

      return NextResponse.json({ url: session.url })

    } else if (type === 'saas') {
      // SaaS 99€/month subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [
          {
            price: STRIPE_PRICE_SAAS,
            quantity: 1,
          },
        ],
        metadata: {
          auditId,
          type: 'saas',
          email,
        },
        subscription_data: {
          metadata: {
            auditId,
            email,
          },
        },
        success_url: `${APP_URL}/dashboard?new=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/results/${auditId}`,
      })

      return NextResponse.json({ url: session.url })

    } else {
      return NextResponse.json({ error: 'Type de paiement invalide' }, { status: 400 })
    }

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
