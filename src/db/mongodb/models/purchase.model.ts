import type { HydratedDocument, InferSchemaType, Types } from 'mongoose'
import { model, Schema } from 'mongoose'

type BasePurchaseDocument = {
  productId: Types.ObjectId
  userId: Types.ObjectId

  stripeEventId: string
  stripeSessionId: string
  stripePaymentIntentId?: string

  amountPaid: number

  // if we want 'purchasedAt' to be part of the database document type
  purchasedAt: Date
}

const purchaseSchema = new Schema<BasePurchaseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // useful for debugging/auditing
    // for example: "Which Stripe webhook event created this purchase?"
    stripeEventId: {
      type: String,
      unique: true,
    },

    // a unique stripeSessionId on purchases prevents multiple purchase records for the same Checkout Session
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },

    stripePaymentIntentId: {
      type: String,
    },

    amountPaid: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'purchasedAt',
      updatedAt: false,
    },
  },
)

export const PurchaseModel = model<BasePurchaseDocument>(
  'Purchase',
  purchaseSchema,
)

export type PurchaseSchemaType = InferSchemaType<typeof purchaseSchema>
export type DbPurchaseDocument = HydratedDocument<PurchaseSchemaType>