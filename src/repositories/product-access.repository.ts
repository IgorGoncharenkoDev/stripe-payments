import type { ProductAccessEntity } from '@/entities/product-access.entity'

export type ProductAccessRepository = {
  create(product: ProductAccessEntity): Promise<void>

  exists(userId: string, productId: string): Promise<boolean>
}
