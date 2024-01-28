import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError from '../../../exceptions/error/index'

import UserIdentificationModel from '../../../models/user/identification'

export default new class UserIdentificationService {
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

  async generatePassword (password: string): Promise<string> {
    if (!password) {
      return
    }

    return await bcrypt.hash(password, 3)
  }

  async save ({ id, fio, email, password }) {
    try {
      const { access, refresh } = this.generateTokens({ id, fio, email })

      await UserIdentificationModel.create({
        userId: id,
        password: await this.generatePassword(password),
        refreshToken: refresh
      })

      return {
        access,
        refresh
      }
    } catch (error) {
      throw ApiError.BadRequest('Произошла ошибка при регистрации пользователя')
    }
  }
}