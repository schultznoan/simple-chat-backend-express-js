import jwt from 'jsonwebtoken'

import ApiError from '../../../exceptions/error/index'

export default new class UserTokensService {
  generateTokens (payload) {
    return {
      access: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: `${process.env.JWT_ACCESS_MAX_AGE}s`
      }),
      refresh: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: `${process.env.JWT_REFRESH_MAX_AGE}s`
      })
    }
  }

  validateToken (token: string, isAccess: boolean = true) {
    try {
      return jwt.verify(token, isAccess ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      throw ApiError.UnauthorizedError()
    }
  }
}