import Stripe from 'stripe'

import { env } from '@/config/env'
import type { FakeProductType } from '@/services/checkout.service'

export const stripe = new Stripe(env.STRIPE_KEY_SECRET)

export async function createCheckoutSession({
  product,
  userId,
}: {
  product: {
    id: string
  } & FakeProductType
  userId: string
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',

    metadata: {
      productId: product.id,
      userId,
    },

    line_items: [
      {
        price_data: {
          currency: 'eur',

          product_data: {
            name: product.title,
          },

          // Stripe expects the amount in the smallest currency unit
          // €49.00 → 4900 cents
          unit_amount: product.price,
        },

        quantity: 1,
      },
    ],

    success_url: `${env.WEB_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.WEB_BASE_URL}/payment/cancelled`,
  })
}

export function constructWebhookEvent(payload: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  )
}
