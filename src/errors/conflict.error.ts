import { AppError } from '@/errors/app.error'

export class ConflictError
  extends AppError
{
  constructor(
    message = 'Resource conflict',
  ) {
    super(409, 'conflict', message)
  }
}