import type { PurchaseEntity } from '@/entities/purchase.entity'
import { logger } from '@/lib/shared/utils/logger'
import type { PurchaseTransaction } from '@/services/purchase/purchase-transaction'

type PurchaseServiceDependencies = {
  transaction: PurchaseTransaction
}

export function createPurchaseService({
  transaction,
}: PurchaseServiceDependencies) {
  return {
    async processPurchase(purchase: PurchaseEntity): Promise<void> {
      return transaction.run(
        async ({
          purchaseRepository,
          productAccessRepository,
          processedEventRepository,
        }) => {
          // only business logic goes here
          // ...

          // The service starts the transaction (BEGIN TRANSACTION)

          // Then:
          const claimed = await processedEventRepository.claim(
            purchase.stripeEventId,
          )

          if (!claimed) {
            logger.error(
              'Stripe webhook already processed; skipping duplicate event',
              { stripeEventId: purchase.stripeEventId },
            )

            // we need to treat the duplicate-key error as:
            // "This event was already processed by another request"
            // But we need to make sure we don't accidentally treat every duplicate-key error as "duplicate webhook.":
            // - Duplicate stripeEventId - is an expected idempotency situation
            // - Duplicate (userId, productId) - could mean something else
            // - Duplicate stripeSessionId - could indicate a different data-integrity problem.
            return
          }

          // if this is the first time we've seen the event then we expect 'claimed === true'
          await purchaseRepository.create(purchase)

          await productAccessRepository.create({
            id: crypto.randomUUID(),
            userId: purchase.userId,
            productId: purchase.productId,
            accessGrantedAt: new Date(),
          })
        },
      )
    },
  }
}
