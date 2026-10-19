import type { ClientSession } from 'mongoose'

import { ProcessedEventModel } from '@/db/mongodb/models/processed-event.model'
import type { ProcessedEventRepository } from '@/repositories/processed-event.repository'

type ProcessedEventRepositoryDependencies = {
  session?: ClientSession
}

export function createProcessedEventRepository({
  session,
}: ProcessedEventRepositoryDependencies = {}): ProcessedEventRepository {
  return {
    async claim(stripeEventId: string) {
      const result = await ProcessedEventModel.updateOne(
        {
          stripeEventId,
        },
        {
          $setOnInsert: {
            stripeEventId,
          },
        },
        // If this event exists, leave it alone.
        // If it doesn't exist, create it.
        {
          upsert: true,
          session,
        },
      )

      /* Supposedly:
       *
       * {
       *   matchedCount: 0,
       *   modifiedCount: 0,
       *   upsertedCount: 1
       * }
       *
       * OR (if MongoDB doesn't insert anything):
       *
       * {
       * matchedCount: 1,
       * modifiedCount: 0,
       * upsertedCount: 0
       * }
       * */

      return result.upsertedCount === 1 // we successfully claimed this event
    },
  }
}