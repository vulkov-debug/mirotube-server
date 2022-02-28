import mongoose from 'mongoose'
const {Schema} = mongoose
const {ObjectId} =Schema

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    video: {},
    description: {
        type: String
    },
    author: {
        type: ObjectId,
        ref: 'user'
    },
    tags: [],
    viewCount: {type: Number}
}, {timestamps: true})

export default mongoose.model('Video', videoSchema)