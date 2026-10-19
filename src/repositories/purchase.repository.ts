import type { PurchaseEntity } from '@/entities/purchase.entity'

export type PurchaseRepository = {
  create(purchase: PurchaseEntity): Promise<void>

  findByStripeSessionId(stripeSessionId: string): Promise<PurchaseEntity | null>
}
