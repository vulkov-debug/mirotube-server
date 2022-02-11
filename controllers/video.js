import AWS from 'aws-sdk'
import {readFileSync} from 'fs'
import {nanoid} from 'nanoid'
import Video from '../models/video'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVerion: process.env.AWS_API_VERSION
}

const S3 = new AWS.S3(awsConfig)

export const uploadVideo = async (req, res) => {
  const {video} = req.files
  
  if(!video) return res.status(400).send('No video')
  const params = {
      Bucket: 'novata-bucket',
      Key: `${nanoid()}.${video.type.split('/')[1]}`,
      Body: readFileSync(video.path),
      ContentType: video.type
  }

  S3.upload(params, (err,data)=> {
      if(err) {
          console.log('Err', err)
          res.status(400).send('Upload failed')
      }
      console.log(data)
      res.send(data)
  })
}


export const videoSave =async (req, res) => {
    // console.log('req body', req.body)
    const {video, title, description} = req.body
//    console.log('req.body =>',req.body)
   try {
    const savedVideo =await new Video({video, title, description}).save()

    return res.send('OK')

   } catch (error) {
          return res.status(400).send(error)       
   }
}