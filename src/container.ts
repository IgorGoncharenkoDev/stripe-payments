/* * This is a composition root - place where the dependencies are assembled.
 * Its job is to create implementations and wire them together.
 *
 * It is saying:
 * "For this application, when somebody asks for the purchase service, use the MongoDB transaction implementation."
 * */

import { createPurchaseService } from '@/services/purchase.service'
import { createMongoPurchaseTransaction } from '@/services/purchase/mongodb-purchase-transaction'

const purchaseTransaction = createMongoPurchaseTransaction()

export const purchaseService = createPurchaseService({
  transaction: purchaseTransaction,
})