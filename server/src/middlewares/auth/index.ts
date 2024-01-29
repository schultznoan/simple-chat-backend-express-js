import ApiError from '../../exceptions/error/index'

import {
  Request,
  Response,
  NextFunction
} from 'express'

import UserTokensService from '../../services/user/tokens/index'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      fio: string;
    }
  }
}

function errorHandler (res: Response, next: NextFunction) {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')

  next(ApiError.UnauthorizedError())
}

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      errorHandler(res, next)

      return
    }

    const accessToken = authorizationHeader.split(' ')?.[1] || ''

    if (!accessToken) {
      errorHandler(res, next)

      return
    }

    const userData = UserTokensService.validateToken(accessToken)

    req.user = userData

    next()
  } catch {
    errorHandler(res, next)
  }
}