import express from 'express'
import formidable from 'express-formidable'
import { requireSignin } from '../middlewares'

import {uploadVideo, videoSave, userVideos, videoRemove, singleVideo, allVideos} from '../controllers/video'

const router = express.Router()

router.post('/video-upload', requireSignin, formidable(), uploadVideo)
router.post('/video-save', requireSignin,videoSave)
router.post('/video-remove', requireSignin, videoRemove)
router.get('/user-videos', requireSignin, userVideos)
router.get('/single-video/:id', requireSignin, singleVideo)
router.get('/videos', requireSignin, allVideos)

module.exports = router