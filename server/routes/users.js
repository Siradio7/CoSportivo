import { Router } from 'express'
import { getUserById, updateUser, deleteUser, updatePassword } from '../controllers/users.js'

const router = Router()

router.get('/:id', getUserById)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/change-password', updatePassword)

export default router