import {
  Request,
  Response,
  NextFunction
} from 'express'

import ChatService from '../../services/chat/index'

export default new class UserController {
  async createMessage (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await ChatService.createMessage(req.body || {}))
    } catch (error) {
      next(error)
    }
  }
}