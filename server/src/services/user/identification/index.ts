import bcrypt from 'bcrypt'
import ApiError from '../../../exceptions/error/index'

import UserIdentificationModel from '../../../models/user/identification'
import UserIdentificationDto from '../../../dtos/user/identification'
import UserTokensService from '../tokens/index'

import { TokensResponse } from '../tokens/interface'

import {
  SavePasswordPayload,
  ComparePasswordPayload
} from './interface'

import { Types } from 'mongoose'

export default new class UserIdentificationService {
  async generatePassword (password: string): Promise<string> {
    if (!password) {
      return
    }

    return await bcrypt.hash(password, 3)
  }

  async save ({ id, email, password }: SavePasswordPayload): Promise<TokensResponse> {
    try {
      const { access, refresh } = UserTokensService.generateTokens({ id, email })

      await UserIdentificationModel.create({
        userId: id,
        password: await this.generatePassword(password)
      })

      return {
        access,
        refresh
      }
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при регистрации пользователя')
    }
  }

  async getPassword (userId: Types.ObjectId): Promise<string> {
    try {
      const userIdentification = await UserIdentificationModel.findOne({ userId })

      if (!userIdentification) {
        return
      }

      return new UserIdentificationDto(userIdentification)?.password
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении пароля')
    }
  }

  async comparePasswords ({ userId, currentPassword }: ComparePasswordPayload): Promise<boolean> {
    try {
      return await bcrypt.compare(currentPassword, await this.getPassword(userId))
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при сравнивании пароля')
    }
  }
}