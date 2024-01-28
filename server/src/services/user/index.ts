import bcrypt from 'bcrypt'

import { validateForm } from '../../lib/validate/index'

import ApiError from '../../exceptions/error/index'

import UserModel from '../../models/user/index'

export default new class UserService {
  async signup ({ fio, email, password }) {
    const errors = validateForm({ fio, email, password })

    if (errors) {
      throw ApiError.BadRequest('Некорректный запрос', errors)
    }

    const findedUser = await UserModel.findOne({ email })

    if (!findedUser) {
      throw ApiError.BadRequest('Пользователь с таким e-mail уже зарегистрирован')
    }

    const user = await UserModel.create({
      fio,
      email,
      password: await bcrypt.hash(password, 3)
    })

    return user
  }
}