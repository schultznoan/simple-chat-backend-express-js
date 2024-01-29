import {
  Request,
  Response,
  NextFunction
} from 'express'

import UserService from '../../services/user/index'

export default new class UserController {
  async signup (req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await UserService.signup(req.body || {})

      res.cookie('access_token', userData.access, { maxAge: +process.env.JWT_ACCESS_MAX_AGE, httpOnly: true })
      res.cookie('refresh_token', userData.refresh, { maxAge: +process.env.JWT_REFRESH_MAX_AGE, httpOnly: true })
    
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async signin (req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await UserService.signin(req.body || {})

      res.cookie('access_token', userData.access, { maxAge: +process.env.JWT_ACCESS_MAX_AGE, httpOnly: true })
      res.cookie('refresh_token', userData.refresh, { maxAge: +process.env.JWT_REFRESH_MAX_AGE, httpOnly: true })

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
}