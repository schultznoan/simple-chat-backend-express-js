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

export default function (req: Request, _res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      next(ApiError.UnauthorizedError())
      return
    }

    const accessToken = authorizationHeader.split(' ')?.[1] || ''

    if (!accessToken) {
      next(ApiError.UnauthorizedError())
      return
    }

    const userData = UserTokensService.validateAccessToken(accessToken)

    req.user = userData

    next()
  } catch {
    next(ApiError.UnauthorizedError());
  }
}