import express from 'express'
import { login, register, checkEmail } from '../controllers/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/check-email', checkEmail)

export default router