import { Router } from 'express'

import {
  httpPostCheckout,
} from '@/api/controllers/payments.controller'

export const paymentsRouter = Router()

paymentsRouter.post('/checkout', httpPostCheckout)
