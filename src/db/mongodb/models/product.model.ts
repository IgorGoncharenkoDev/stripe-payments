import type { HydratedDocument, InferSchemaType } from 'mongoose'
import { model, Schema } from 'mongoose'

type BaseProductDocument = {
  title: string
  price: number
}

const productSchema = new Schema<BaseProductDocument>(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
)

export const ProductModel = model<BaseProductDocument>(
  'Product',
  productSchema,
)

export type ProductSchemaType = InferSchemaType<typeof productSchema>
export type DbProductDocument = HydratedDocument<ProductSchemaType>
