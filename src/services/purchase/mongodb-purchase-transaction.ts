import mongoose from 'mongoose'

import { createProcessedEventRepository } from '@/repositories/mongodb/processed-event.repository'
import { createProductAccessRepository } from '@/repositories/mongodb/product-access.repository'
import { createPurchaseRepository } from '@/repositories/mongodb/purchase.repository'

import type { PurchaseTransaction } from './purchase-transaction'

export function createMongoPurchaseTransaction(): PurchaseTransaction {
  return {
    async run(callback) {
      const session = await mongoose.startSession()

      try {
        return await session.withTransaction(async () => {
          const repositories = {
            purchaseRepository: createPurchaseRepository({ session }),

            productAccessRepository: createProductAccessRepository({ session }),

            processedEventRepository: createProcessedEventRepository({
              session,
            }),
          }

          return callback(repositories)
        })
      } finally {
        await session.endSession()
      }
    },
  }
}
