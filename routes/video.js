import express from 'express'
import formidable from 'express-formidable'
import { requireSignin } from '../middlewares'

import {uploadVideo, videoSave, userVideos, videoRemove, singleVideo, allVideos, videoEdit, videoEditSubmit, getVideosByTag, popularVideos} from '../controllers/video'

const router = express.Router()

router.post('/video-upload', requireSignin, formidable(), uploadVideo)
router.post('/video-save', requireSignin,videoSave)
router.post('/video-remove', requireSignin, videoRemove)
router.get('/user-videos/:skip', requireSignin, userVideos)
router.get('/single-video/:id', requireSignin, singleVideo)
router.put('/video-edit', requireSignin, formidable() ,videoEdit)
router.post('/video-edit-submit/:id', requireSignin, videoEditSubmit)
router.get('/videos/:skip', requireSignin, allVideos)
router.post('/get-videos-by-tag', requireSignin, getVideosByTag)
router.get('/popular-videos/:skip', requireSignin, popularVideos)



module.exports = router