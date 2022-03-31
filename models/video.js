import mongoose from 'mongoose'
const {Schema} = mongoose
const {ObjectId} =Schema

const voteSchema = new Schema({
    user: {type: ObjectId, ref: 'User', unique: true}, 
    rate: {type: Number},
    _id: false
})


const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
        text: true
    },
    video: {},
    description: {
        type: String
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    tags: [],
    viewCount: {type: Number, default:0},
    rate: {type: Number, default: 3},
    voted: [voteSchema]
}, {timestamps: true})

export default mongoose.model('Video', videoSchema)