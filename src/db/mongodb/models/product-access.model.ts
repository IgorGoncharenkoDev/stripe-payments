import type { HydratedDocument, InferSchemaType, Types } from 'mongoose'
import { model, Schema } from 'mongoose'

type BaseProductAccessDocument = {
  productId: Types.ObjectId
  userId: Types.ObjectId

  // if we want 'accessGrantedAt' to be part of the database document type
  accessGrantedAt: Date
}

const productAccessSchema = new Schema<BaseProductAccessDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'accessGrantedAt',
      updatedAt: false,
    },
  },
)

// The compound index in MongoDB serves the same purpose as the UNIQUE constraint in PostgreSQL -
// It prevents duplicate access records.
productAccessSchema.index(
  {
    userId: 1,
    productId: 1,
  },
  {
    unique: true,
  },
)

export const ProductAccessModel = model<BaseProductAccessDocument>(
  'ProductAccess',
  productAccessSchema,
)

export type ProductAccessSchemaType = InferSchemaType<
  typeof productAccessSchema
>
export type DbProductAccessDocument = HydratedDocument<ProductAccessSchemaType>
