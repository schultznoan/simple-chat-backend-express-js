import { validateForm } from '../../lib/validate/index'

import ApiError from '../../exceptions/error/index'

import UserModel from '../../models/user/index'

import UserIdentificationService from './identification/index'
import UserTokensService from './tokens/index'

import UserDto from '../../dtos/user/index'

import {
  UserPayload,
  UserResponse,
} from './interface'

import {
  TokensResponse
} from './tokens/interface'

export default new class UserService {
  async signup ({ fio, email, password }: UserPayload): Promise<UserResponse> {
    const errors: Record<string, string> = validateForm({ fio, email, password })

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
    } catch ({ message, errors }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при регистрации пользователя', errors)
    }
  }

  async signin ({ email, password }: UserPayload): Promise<UserResponse> {
    const errors = validateForm({ email, password })

    if (errors) {
      throw ApiError.BadRequest('Некорректный запрос', errors)
    }

    const findedUser = await UserModel.findOne({ email })

    if (!findedUser) {
      throw ApiError.BadRequest('Пользователь с таким e-mail не найден')
    }

    try {
      const isEqualPasswords: boolean = await UserIdentificationService.comparePasswords({ userId: findedUser._id, currentPassword: password })

      if (!isEqualPasswords) {
        throw ApiError.BadRequest('Неверный логин/пароль')
      }

      return {
        ...UserTokensService.generateTokens({ id: findedUser._id, email }),
        ...new UserDto(findedUser)
      }
    } catch ({ message, errors }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при авторизации пользователя', errors)
    }
  }

  async getUsers (query: string): Promise<Array<UserDto>> {
    try {
      const users = query
        ? await UserModel
          .find({ fio: new RegExp(query, 'i') })
          .sort({ fio: 1 })
        : await UserModel.find()

      const userDtos: Array<UserDto> = []

      for (let i = 0; i < users.length; i++) {
        userDtos.push(new UserDto(users[i]))
      }
      
      return userDtos
    } catch ({ message, errors }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при поиске пользователей')
    }
  }

  async refresh (refreshToken: string): Promise<TokensResponse> {
    try {
      if (!refreshToken) {
        throw ApiError.UnauthorizedError()
      }
  
      const userData = UserTokensService.validateToken(refreshToken, false)
  
      if (!userData) {
        throw ApiError.UnauthorizedError()
      }

      return UserTokensService.generateTokens(userData)
    } catch ({ message, errors }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при обновлении токена')
    }
  }
}