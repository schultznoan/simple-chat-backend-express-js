import {
  Request,
  Response,
  NextFunction
} from 'express'

import ChatService from '../../services/chat/index'

export default new class UserController {
  async createMessage (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await ChatService.createMessage({ ...(req.body || {}), userId: req.user.id }))
    } catch (error) {
      next(error)
    }
  }

  async getDialog (req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await ChatService.getDialogs(req.query.dialogId as string))
    } catch (error) {
      next(error)
    }
  }
}