import { Router } from 'express'

import UserController from '../controllers/user/index'
import ChatController from '../controllers/chat/index'

import authMiddleware from '../middlewares/auth/index'

const router = Router()

router.get('/users', authMiddleware, UserController.getUsers)
router.get('/users/auth/refresh', authMiddleware, UserController.refresh)
router.post('/users/auth/signin', UserController.signin)
router.post('/users/auth/signup', UserController.signup)

router.get('/chat/dialog', authMiddleware, ChatController.getDialog)
router.get('/chat/message', authMiddleware, ChatController.getMessages)
router.post('/chat/message', authMiddleware, ChatController.createMessage)

export default router