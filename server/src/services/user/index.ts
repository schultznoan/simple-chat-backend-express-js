import { validateForm } from '../../lib/validate/index'

import ApiError from '../../exceptions/error/index'

import UserModel from '../../models/user/index'

import UserIdentificationService from './identification/index'
import UserTokensService from './tokens/index'

import UserDto from '../../dtos/user/index'

export default new class UserService {
  async signup ({ fio, email, password }) {
    const errors = validateForm({ fio, email, password })

    if (errors) {
      throw ApiError.BadRequest('Некорректный запрос', errors)
    }

    const findedUser = await UserModel.findOne({ email })

    if (findedUser) {
      throw ApiError.BadRequest('Пользователь с таким e-mail уже зарегистрирован')
    }

    try {
      const createdUser = await UserModel.create({ fio, email })
      const userDto = new UserDto(createdUser)
      const tokens = await UserIdentificationService.save({ id: userDto.id, email, password })

      return {
        ...tokens,
        ...userDto
      }
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при регистрации пользователя')
    }
  }

  async signin ({ email, password }) {
    const errors = validateForm({ email, password })

    if (errors) {
      throw ApiError.BadRequest('Некорректный запрос', errors)
    }

    const findedUser = await UserModel.findOne({ email })

    if (!findedUser) {
      throw ApiError.BadRequest('Пользователь с таким e-mail не найден')
    }

    try {
      const isEqualPasswords = await UserIdentificationService.comparePasswords({ userId: findedUser._id, currentPassword: password })

      if (!isEqualPasswords) {
        throw ApiError.BadRequest('Неверный логин/пароль')
      }

      return {
        ...UserTokensService.generateTokens({ id: findedUser._id, email }),
        ...new UserDto(findedUser)
      }
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при авторизации пользователя')
    }
  }

  async getUsers (query: string) {
    try {
      if (query) {
        return await UserModel
          .find({ fio: new RegExp(query, 'i') })
          .sort({ fio: 1 })
      }
  
      return await UserModel.find()
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при поиске пользователей')
    }
  }

  async refresh (refreshToken: string) {
    try {
      if (!refreshToken) {
        throw ApiError.UnauthorizedError()
      }
  
      const userData = UserTokensService.validateToken(refreshToken, false)
  
      if (!userData) {
        throw ApiError.UnauthorizedError()
      }

      return UserTokensService.generateTokens(userData)
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при обновлении токена')
    }
  }
}