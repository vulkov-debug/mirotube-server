import express from 'express'
const router = express.Router()
import {requireSignin} from '../middlewares'

import {addPlaylist, getPlaylists, getPlaylistVideos, addVideosToPlaylist, updatePlaylist, deleteVideoFromPlaylist} from '../controllers/playlist'

router.post('/add-playlist', requireSignin, addPlaylist )
router.get('/get-playlists', requireSignin, getPlaylists)
router.post('/get-playlist-videos', requireSignin, getPlaylistVideos)

router.post('/add-videos-to-playlist', requireSignin, addVideosToPlaylist)
router.get('/delete-video-from-playlist/:playlist/:video', requireSignin, deleteVideoFromPlaylist)
router.post('/update-playlist', requireSignin, updatePlaylist)


module.exports= router