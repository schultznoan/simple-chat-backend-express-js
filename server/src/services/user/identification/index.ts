import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError from '../../../exceptions/error/index'

import UserIdentificationModel from '../../../models/user/identification'
import UserIdentificationDto from '../../../dtos/user/identification'

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

  async save ({ id, email, password }) {
    try {
      const { access, refresh } = this.generateTokens({ id, email })

      await UserIdentificationModel.create({
        userId: id,
        password: await this.generatePassword(password)
      })

      return {
        access,
        refresh
      }
    } catch (error) {
      throw ApiError.BadRequest('Произошла ошибка при регистрации пользователя')
    }
  }

  async getPassword (userId) {
    try {
      const userIdentification = await UserIdentificationModel.findOne({ userId })

      if (!userIdentification) {
        return
      }

      return new UserIdentificationDto(userIdentification)?.password
    } catch (error) {
      throw ApiError.BadRequest('Произошла ошибка при получении пароля')
    }
  }

  async comparePasswords ({ userId, currentPassword }) {
    try {
      return await bcrypt.compare(currentPassword, await this.getPassword(userId));
    } catch (error) {
      throw ApiError.BadRequest('Произошла ошибка при сравнивании пароля')
    }
  }
}