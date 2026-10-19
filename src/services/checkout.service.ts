import { ConflictError } from '@/errors/conflict.error'
import { logger } from '@/lib/shared/utils/logger'
import { hasUserProductAccess } from '@/repositories/mongodb/product-access.repository'
import { createCheckoutSession } from '@/services/stripe.service'

// temporary replacement for db
export type FakeProductType = {
  price: number
  title: string
}

const fakeProductIds = [
  '671a00000000000000000001',
  '671a00000000000000000002',
  '671a00000000000000000003',
]

const fakeProducts: Record<string, FakeProductType> = {
  [fakeProductIds[0]]: {
    title: 'Product 1',
    price: 4900,
  },

  [fakeProductIds[1]]: {
    title: 'Product 2',
    price: 3900,
  },

  [fakeProductIds[2]]: {
    title: 'Product 3',
    price: 2900,
  },
}

export async function handleCheckout({
  productId,
  userId,
}: {
  productId: string
  userId: string
}) {
  // database lookup here: find the product in the db, get the price and whatever else is needed
  const dbProduct = fakeProducts[productId as keyof typeof fakeProducts]

  if (!dbProduct) {
    throw new Error('Product not found')
  }

  // prevent duplicate purchases:
  //  a user who already owns a product should not create another Checkout Session for that product.
  // ...
  // There is a database unique constraint rejects a duplicate purchase despite the earlier check.
  // That can happen if two checkout requests race, so the database constraint remains important.
  // ...
  // The database uniqueness constraints remain the final protection against concurrent requests.
  const hasAccessToProduct = await hasUserProductAccess({
    productId,
    userId,
  })

  if (hasAccessToProduct) {
    logger.info('Checkout rejected: product already purchased', {
      userId,
      productId,
    })

    // semantics: "Your request is valid, but it conflicts with the current state of the resource."
    throw new ConflictError('You have already purchased this product')
  }

  return await createCheckoutSession({
    product: {
      id: productId,
      ...dbProduct,
    },
    userId,
  })
}
