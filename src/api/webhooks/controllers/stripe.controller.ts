import type { Request, Response } from 'express'

import { purchaseService } from '@/container'
import type { PurchaseEntity } from '@/entities/purchase.entity'
import { logger } from '@/lib/shared/utils/logger'
import { constructWebhookEvent } from '@/services/stripe.service'

export async function httpPostWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature']

  if (!signature || typeof signature !== 'string') {
    return res.sendStatus(400)
  }

  // Step 1: Verify the signature and construct the event.
  let event: ReturnType<typeof constructWebhookEvent>

  try {
    event = constructWebhookEvent(req.body as Buffer, signature)
  } catch (error) {
    logger.error('❌ Stripe webhook signature verification failed', { error })

    return res.sendStatus(400)
  }

  // Step 2: Acknowledge events this handler doesn't process (irrelevant event type)
  if (event.type !== 'checkout.session.completed') {
    return res.sendStatus(200)
  }

  // Step 3: Process the event. Failures here must not be mislabeled as signature failures.
  try {
    const session = event.data.object

    // grants access only after payment is complete
    if (session.payment_status !== 'paid') {
      logger.info('Checkout Session is not paid; access not granted', {
        sessionId: session.id,
      })

      return res.sendStatus(200)
    }

    const { productId, userId } = session.metadata ?? {}

    if (!userId || !productId) {
      throw new Error(
        `Checkout Session ${session.id} is missing required metadata`,
      )
    }

    if (session.amount_total === null) {
      throw new Error(`Checkout Session ${session.id} has no total amount`)
    }

    // constructing the domain Purchase
    const purchase: PurchaseEntity = {
      // keeping 'id' temporarily so the domain entity remains complete
      // (in general because MongoDB generates '_id')
      // MongoDB repository does not need to persist that value as _id;
      // Mongoose can generate its own _id, which is then mapped back to Purchase.id when reading a purchase.
      id: crypto.randomUUID(),
      userId,
      productId,
      stripeEventId: event.id,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : (session.payment_intent?.id ?? undefined),
      amountPaid: session.amount_total,
      purchasedAt: new Date(),
    }

    // const processedPurchase =
    await purchaseService.processPurchase(purchase)

    // Successful purchase processing response
    return res.sendStatus(200)
  } catch (error) {
    logger.error('Failed to process Stripe webhook', {
      err: error,
      stripeEventId: event.id,
    })

    return res.sendStatus(500)
  }
}
