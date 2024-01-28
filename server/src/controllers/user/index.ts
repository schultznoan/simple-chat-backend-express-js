import {
  Request,
  Response,
  NextFunction
} from 'express'

import UserService from '../../services/user/index'

export default new class UserController {
  async signup (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await UserService.signup(req.body || {}))
    } catch (error) {
      next(error)
    }
  }

  async signin (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await UserService.signin(req.body || {}))
    } catch (error) {
      next(error)
    }
  }
}