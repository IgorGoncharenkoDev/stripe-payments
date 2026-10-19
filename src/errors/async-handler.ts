// With express@5+ rejected promises and exceptions thrown inside async route handlers and middleware
// are automatically forwarded to the error middleware ( src/app.ts: app.use(errorMiddleware) )

import type { NextFunction, Request, Response } from 'express'

// export function asyncHandler(controller: AsyncController) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(controller(req, res, next)).catch(next)
//   }
// }

export function asyncHandler<
  Req extends Request = Request,
  Res extends Response = Response,
>(controller: (req: Req, res: Res, next: NextFunction) => Promise<unknown>) {
  return (req: Req, res: Res, next: NextFunction) => {
    controller(req, res, next).catch(next)
  }
}