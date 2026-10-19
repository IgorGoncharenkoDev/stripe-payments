export type AppErrorType =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'bad_request'
  | 'conflict'
  | 'external_error'

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly type: AppErrorType,
    message: string,
  ) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}