import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { appRouter } from '@/api/routes'
import { webhooksRouter } from '@/api/webhooks'
import { errorMiddleware } from '@/middlewares/error.middleware'
import { notFoundMiddleware } from '@/middlewares/not-found.middleware'

import { healthRouter } from './api/health.route'

const app = express()

// Global middlewares
app.use(cors())
app.use(helmet())

// TODO i |> remove later
// app.use(express.json())

// Webhooks
app.use(
  '/webhooks',
  express.raw({
    type: 'application/json',
  }),
  webhooksRouter,
)

// Routes
app.use('/health', healthRouter)
app.use('/api', express.json(), appRouter)

// 404 handler
app.use(notFoundMiddleware)

// Error handler
app.use(errorMiddleware)

export default app;