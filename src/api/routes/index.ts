import { Router } from 'express'

import { authRouter } from '@/api/routes/auth.route'
import { paymentsRouter } from '@/api/routes/payments.route'
import { userRouter } from '@/api/routes/user.route'

export const appRouter = Router()

appRouter.use('/auth', authRouter)
appRouter.use('/users', userRouter)
appRouter.use('/payments', paymentsRouter)
