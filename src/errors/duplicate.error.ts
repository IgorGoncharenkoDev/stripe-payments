import { AppError } from './app.error'

export class DuplicateError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, 'conflict', message)
  }
}
