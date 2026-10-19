import { Router } from 'express'

export const userRouter = Router()

userRouter.get('/', (_req, res) => {
  res.json({
    message: 'All users',
  })
})

userRouter.get('/:id', (req, res) => {
  res.json({
    message: `User ${req.params.id}`,
  })
})
