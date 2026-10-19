import type { Request, Response } from 'express'

import { handleCheckout } from '@/services/checkout.service'

export async function httpPostCheckout(req: Request, res: Response) {
  const { productId } = req.body

  // TODO i |> auth implementation is required
  const userId = /*req.user.id*/ '670a00000000000000000001'

  const session = await handleCheckout({
    productId,
    userId,
  })

  res.json({
    url: session.url,
  })
}
