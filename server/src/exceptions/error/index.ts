import { StatusCodes } from 'http-status-codes'
import { ErrorType } from './interface'

export default class ApiError extends Error {
  status: StatusCodes.BAD_REQUEST
  message: string = 'Произошлка ошибка сервера'
  errors: ErrorType = {}

  constructor (status: number, message: string, errors: ErrorType = {}) {
    super(message)

    this.status = status
    this.errors = errors
    this.message = message
  }

  static UnauthorizedError (): Error {
    return new ApiError(StatusCodes.UNAUTHORIZED, 'Пользователь не авторизован')
  }

  static BadRequest (message: string, errors: ErrorType = {}): Error {
    return new ApiError(StatusCodes.BAD_REQUEST, message, errors)
  }
}