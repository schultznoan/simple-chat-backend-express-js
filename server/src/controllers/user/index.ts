import {
  Request,
  Response,
  NextFunction
} from 'express'
import { StatusCodes } from 'http-status-codes'

import UserService from '../../services/user/index'

import cookieHandler from '../../lib/handlers/cookie'

export default new class UserController {
  async signup (req: Request, res: Response, next: NextFunction) {
    try {
      const { access, refresh, ...userData } = await UserService.signup(req.body || {})

      cookieHandler(res, { access, refresh })
    
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async signin (req: Request, res: Response, next: NextFunction) {
    try {
      const { access, refresh, ...userData } = await UserService.signin(req.body || {})

      cookieHandler(res, { access, refresh })

      return res.json(userData) 
    } catch (error) {
      next(error)
    }
  }

  async getUsers (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await UserService.getUsers(req.query.search as string))
    } catch (error) {
      next(error)
    }
  }

  async refresh (req: Request, res: Response, next: NextFunction) {
    try {
      const { access, refresh } = await UserService.refresh(req.cookies.refresh)

      cookieHandler(res, { access, refresh })

      return res.status(StatusCodes.NO_CONTENT).json()
    } catch (error) {
      next(error)
    }
  }
}