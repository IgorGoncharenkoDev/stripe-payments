import type { ClientSession } from 'mongoose'

import { PurchaseModel } from '@/db/mongodb/models/purchase.model'
import type { PurchaseEntity } from '@/entities/purchase.entity'
import type { PurchaseRepository } from '@/repositories/purchase.repository'

type PurchaseRepositoryDependencies = {
  session?: ClientSession
}

export function createPurchaseRepository({
  session,
}: PurchaseRepositoryDependencies = {}): PurchaseRepository {
  return {
    async create(purchase: PurchaseEntity) {
      try {
        await PurchaseModel.create(
          [
            {
              userId: purchase.userId,
              productId: purchase.productId,
              stripeEventId: purchase.stripeEventId,
              stripePaymentIntentId: purchase.stripePaymentIntentId,
              stripeSessionId: purchase.stripeSessionId,
              amountPaid: purchase.amountPaid,
            },
          ],
          { session },
        )
      } catch (error) {
        throw new Error('Purchase was not created...')
      }
    },

    async findByStripeSessionId(stripeSessionId: string) {
      const document = await PurchaseModel.findOne({ stripeSessionId })
        .session(session ?? null)
        .lean()

      if (!document) {
        return null
      }

      return {
        id: document._id.toString(),
        // the conversion is the responsibility of the DB-specific repository
        userId: document.userId.toString(),
        productId: document.productId.toString(),
        stripeEventId: document.stripeEventId,
        stripeSessionId: document.stripeSessionId,
        stripePaymentIntentId: document.stripePaymentIntentId,
        amountPaid: document.amountPaid,
        purchasedAt: document.purchasedAt,
      }
    },
  }
}