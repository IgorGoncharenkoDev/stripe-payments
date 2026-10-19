import type { ProcessedEventRepository } from '@/repositories/processed-event.repository'
import type { ProductAccessRepository } from '@/repositories/product-access.repository'
import type { PurchaseRepository } from '@/repositories/purchase.repository'

export type PurchaseRepositories = {
  purchaseRepository: PurchaseRepository
  productAccessRepository: ProductAccessRepository
  processedEventRepository: ProcessedEventRepository
}
