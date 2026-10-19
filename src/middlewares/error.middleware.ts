import type {
  NextFunction,
  Request,
  Response,
} from 'express'

import { AppError } from '@/errors/app.error'
import { ValidationError } from '@/errors/validation.error'
import { logger } from '@/lib/shared/utils/logger';

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error('Error Middleware - Request failed:', {
    error,
  })

  if (
    error instanceof ValidationError
  ) {
    return res.status(
      error.statusCode,
    ).json({
      message: error.message,
      errors: error.errors,
    })
  }

  if (error instanceof AppError) {
    return res.status(
      error.statusCode,
    ).json({
      message: error.message,
    })
  }

  return res.status(500).json({
    message: 'Internal server error',
  })
}