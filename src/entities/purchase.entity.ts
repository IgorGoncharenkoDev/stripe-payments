export type PurchaseEntity = {
  id: string
  userId: string
  productId: string

  stripeEventId: string
  stripeSessionId: string
  stripePaymentIntentId?: string

  amountPaid: number
  purchasedAt: Date
}
