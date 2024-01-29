import { Router } from 'express'
import UserController from '../controllers/user'

const router = Router()

router.get('/users', UserController.getUsers)
router.get('/users/auth/refresh')
router.post('/users/auth/signin', UserController.signin)
router.post('/users/auth/signup', UserController.signup)

router.get('/chat/dialog')
router.get('/chat/dialog/:id')
router.post('/chat/dialog')
router.post('/chat/message')

export default router