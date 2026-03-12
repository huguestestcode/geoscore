import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export const STRIPE_PRICE_ONESHOT = process.env.STRIPE_PRICE_ONSHOT || ''
export const STRIPE_PRICE_SAAS = process.env.STRIPE_PRICE_SAAS || ''
