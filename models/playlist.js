const mongoose = require('mongoose')
const {Schema} = mongoose

const {ObjectId} = Schema

const playlistSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  owner: {
      type: ObjectId,
      ref: 'User'
  },
  videos: [{type: ObjectId, ref: 'Video'}]
  
}) 

export default mongoose.model('Playlist', playlistSchema)