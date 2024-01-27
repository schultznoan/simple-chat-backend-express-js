import ApiError from '../../exceptions/error/index'
import {
  Request,
  Response
} from 'express'

export default function (error: ApiError, _req: Request, res: Response) {
  const { status, message, errors } = error

  if (error instanceof ApiError) {
    return res
      .status(status)
      .json({ message, errors })
  }

  return res
    .status(500)
    .json({ message: 'Произошла ошибка сервера', errors: {} })
}