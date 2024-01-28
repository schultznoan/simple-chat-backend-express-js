import { validateForm } from '../../lib/validate/index'

import ApiError from '../../exceptions/error/index'

import UserModel from '../../models/user/index'

import UserIdentificationService from './identification'

import UsernDto from '../../dtos/user/index'

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
      const { _id: id } = await UserModel.create({ fio, email })

      return await UserIdentificationService.save({ id, email, password })
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

      return UserIdentificationService.generateTokens({ id: findedUser._id, email })
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при авторизации пользователя')
    }
  }
}