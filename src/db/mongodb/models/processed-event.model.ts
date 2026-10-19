import type { HydratedDocument, InferSchemaType } from 'mongoose'
import { model, Schema } from 'mongoose'

type BaseProcessedEventDocument = {
  stripeEventId: string
}

const processedEventSchema = new Schema<BaseProcessedEventDocument>(
  // a unique 'stripeEventId' on purchases prevents duplicate event IDs
  {
    stripeEventId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: 'processedAt',
      updatedAt: false,
    },
  },
)

export const ProcessedEventModel = model<BaseProcessedEventDocument>(
  'ProcessedEvent',
  processedEventSchema,
)

export type ProcessedEventSchemaType = InferSchemaType<typeof processedEventSchema>
export type DbProcessedEventDocument = HydratedDocument<ProcessedEventSchemaType>
