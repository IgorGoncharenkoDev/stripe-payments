import { AppError } from './app.error'

export class ValidationError extends AppError {
  constructor(public readonly errors: unknown) {
    super(400, 'bad_request', 'Request validation failed')
  }
}
