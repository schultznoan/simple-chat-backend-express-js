import { Router } from 'express'
import UserController from '../controllers/user'

const router = Router()

router.get('/user')
router.get('/user/:identification')
router.get('/user/auth/refresh')
router.post('/user/auth/signin', UserController.signin)
router.post('/user/auth/signup', UserController.signup)

router.get('/chat/dialog')
router.get('/chat/dialog/:id')
router.post('/chat/dialog')
router.post('/chat/message')

export default router