import type { PurchaseRepositories } from './purchase-repositories'

export type PurchaseTransaction = {
  run<T>(
    callback: (repositories: PurchaseRepositories) => Promise<T>,
  ): Promise<T>
}
