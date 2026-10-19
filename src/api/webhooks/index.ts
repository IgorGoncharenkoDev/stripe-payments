import { Router } from 'express'

import { stripeWebhookRouter } from '@/api/webhooks/stripe.webhook'

export const webhooksRouter = Router()

webhooksRouter.use('/stripe', stripeWebhookRouter)
