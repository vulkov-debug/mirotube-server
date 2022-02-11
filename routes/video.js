import express from 'express'
import formidable from 'express-formidable'
import { requireSignin } from '../middlewares'

import {uploadVideo, videoSave} from '../controllers/video'

const router = express.Router()

router.post('/video-upload', requireSignin, formidable(), uploadVideo)
router.post('/video-save', requireSignin,videoSave)

module.exports = router