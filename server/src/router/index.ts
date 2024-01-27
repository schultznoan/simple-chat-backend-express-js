import { Router } from 'express'

const router = Router()

router.get('/user')
router.get('/user/:identification')
router.get('/user/refresh')
router.post('/user/signin')
router.post('/user/signup')

router.get('/chat/dialog')
router.get('/chat/dialog/:id')
router.post('/chat/dialog')
router.post('/chat/message')

export default router