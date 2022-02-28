import AWS from "aws-sdk";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";
import Video from "../models/video";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVerion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadVideo = async (req, res) => {
  const { video } = req.files;

  if (!video) return res.status(400).send("No video");
  const params = {
    Bucket: "novata-bucket",
    Key: `${nanoid()}.${video.type.split("/")[1]}`,
    Body: readFileSync(video.path),
    ContentType: video.type,
  };

  S3.upload(params, (err, data) => {
    if (err) {
      console.log("Err", err);
      res.status(400).send("Upload failed");
    }
    //   console.log(data)
    res.send(data);
  });
};

export const videoSave = async (req, res) => {
  // console.log('req body', req.body)
  const { video, title, description } = req.body;
  //    console.log('req.body =>',req.body)
  try {
    const savedVideo = await new Video({
      video,
      title,
      description,
      author: req.user._id,
    }).save();

    return res.send("OK");
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const userVideos = async (req, res) => {
  try {
    const videos = await Video.find({ author: req.user._id }).exec();
    res.send(videos);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const videoRemove = async (req, res) => {
  try {
    await Video.findByIdAndRemove(req.body._id).exec();
    const params = {
      Bucket: req.body.video.Bucket,
      Key: req.body.video.Key,
    };
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (error) {
    console.log(error);
    res.send("Video remove failed");
  }
};

export const singleVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).exec();
    res.json(video);
  } catch (error) {
    console.log(error);
    res.send("Error single video ");
  }
};

export const allVideos = async (req, res) => {
  try {
    const all = await Video.find({}).exec();
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const videoEdit = async (req, res) => {
  try {
   
    const { video } = req.files;

  
    if (!video) return res.status(400).send("No video");

    const params = {
      Bucket: "novata-bucket",
      Key: `${nanoid()}.${video.type.split("/")[1]}`,
      Body: readFileSync(video.path),
      ContentType: video.type,
    };
  
   S3.upload(params, (err, data) => {
      if (err) {
        console.log("Err", err);
        res.status(400).send("Upload failed");
      }
    //  const updatedVideo = Video.findByIdAndUpdate(id, data, {new: true}).exec()     
      res.send(data);
    });
  
  } catch (error) {
    res.status(400).send(error)      
  }

};


export const videoEditSubmit = async (req, res) => {
  try {
    const {id} = req.params
  const {title, description, video} = req.body

  const videoToBeUpdated = await Video.findByIdAndUpdate(id, {title, description, video}).exec()

  res.send({ok:true})
  } catch (error) {
    res.status(400).send(error)
  }


}