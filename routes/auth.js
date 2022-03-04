import express from 'express'
import { register,login, currentUser, logout, incrementViewsCount } from '../controllers/auth';
import { requireSignin } from '../middlewares';

const router = express.Router()

router.post('/login', login)
router.get('/logout', logout)

router.post('/register', register)
router.get('/current-user', requireSignin, currentUser)

router.post('/increment-views-count', requireSignin, incrementViewsCount)

module.exports = router