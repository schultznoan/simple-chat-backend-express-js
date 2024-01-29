import ApiError from '../../exceptions/error/index'
import {
  Request,
  Response,
  NextFunction
} from 'express'

export default function (error: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const { status, message, errors } = error

  console.error(error)

  if (error instanceof ApiError) {
    return res
      .status(status)
      .json({ message, errors })
  }

  return res
    .status(500)
    .json({ message: 'Произошла ошибка сервера', errors: {} })
}