import express from 'express'
import { register,login } from '../controllers/auth';

const router = express.Router()

router.post('/login', login)

router.post('/register', register)


module.exports = router