import type { ClientSession } from 'mongoose'

import { ProductAccessModel } from '@/db/mongodb/models/product-access.model'
import type { ProductAccessEntity } from '@/entities/product-access.entity'
import type { ProductAccessRepository } from '@/repositories/product-access.repository'

type ProductAccessRepositoryDependencies = {
  session?: ClientSession
}

export function createProductAccessRepository({
  session,
}: ProductAccessRepositoryDependencies = {}): ProductAccessRepository {
  return {
    async create(productAccess: ProductAccessEntity) {
      await ProductAccessModel.create(
        [
          {
            userId: productAccess.userId,
            productId: productAccess.productId,
            accessGrantedAt: productAccess.accessGrantedAt,
          },
        ],
        { session },
      )
    },

    async exists(userId, courseId) {
      const productAccess = await ProductAccessModel.exists({
        userId,
        courseId,
      }).session(session ?? null)

      return Boolean(productAccess)
    },
  }
}

type HasUserProductAccessParams = {
  userId: string
  productId: string
}

export async function hasUserProductAccess({
  productId,
  userId,
}: HasUserProductAccessParams): Promise<boolean> {
  const exists = await ProductAccessModel.exists({
    productId,
    userId,
  })

  return Boolean(exists)
}