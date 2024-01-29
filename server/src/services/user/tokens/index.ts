import jwt from 'jsonwebtoken'

export default new class UserTokensService {
  generateTokens (payload) {
    return {
      access: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_MAX_AGE
      }),
      refresh: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_MAX_AGE
      })
    }
  }
}