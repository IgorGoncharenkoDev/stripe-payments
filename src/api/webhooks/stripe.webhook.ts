import { Router } from 'express'

import { httpPostWebhook } from '@/api/webhooks/controllers/stripe.controller'

export const stripeWebhookRouter = Router()

stripeWebhookRouter.post('/', httpPostWebhook)
