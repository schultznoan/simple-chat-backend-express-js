import { validateForm } from '../../lib/validate/index'

import ApiError from '../../exceptions/error/index'

import UserModel from '../../models/user/index'

import UserIdentificationService from './identification'

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

      return await UserIdentificationService.save({ id, fio, email, password })
    } catch (error) {
      throw ApiError.BadRequest('Произошла ошибка при регистрации пользователя')
    }
  }
}