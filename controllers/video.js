import AWS from "aws-sdk";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";
import Video from "../models/video";
import User from "../models/user";

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
  const { video, title, description, tags } = req.body;
  //    console.log('req.body =>',req.body)
  try {
    const savedVideo = await new Video({
      video,
      title,
      description,
      author: req.user._id,
      tags,
    }).save();

    return res.send("OK");
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const userVideos = async (req, res) => {
  try {
    const { skip } = req.params;
    const videos = await Video.find({ author: req.user._id })
      .skip(skip)
      .limit(20)
      .exec();
    const count = await Video.find({ author: req.user._id }).count().exec();
    res.send({ videos, count });
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
    const video = await Video.findById(id)
      .populate("author", "-password")
      .exec();
    res.json(video);
  } catch (error) {
    console.log(error);
    res.send("Error single video ");
  }
};

export const allVideos = async (req, res) => {
  const { skip } = req.params;
  try {
    const count = await Video.count().exec();
    const all = await Video.find({}).skip(skip).limit(20).exec();
    res.json({ all, count });
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
    res.status(400).send(error);
  }
};

export const videoEditSubmit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video, tags } = req.body;

    const videoToBeUpdated = await Video.findByIdAndUpdate(id, {
      title,
      description,
      video,
      tags,
    }).exec();

    res.send({ ok: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getVideosByTag = async (req, res) => {
  try {
    const videosWithSelectedTags = [];

    for (let i = 0; i < req.body.length; i++) {
      const videos = await Video.find({ tags: req.body[i] });
      videosWithSelectedTags.push(videos);
    }

    res.send(videosWithSelectedTags[0]);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const incrementViewsCount = async (req, res) => {
  try {
    const { id } = req.body;
  } catch (error) {
    res.status(400).send(error);
  }
};

export const popularVideos = async (req, res) => {
  try {
    const { skip } = req.params;
    const videos = await Video.find({})
      .sort({ viewCount: -1 })
      .skip(skip)
      .limit(20)
      .exec();
    const count = await Video.find().count().exec();
    res.send({ videos, count });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.params;
    const results = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(10);
    res.send(results);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const writeHistory = async (req, res) => {
  try {
    const { search } = req.body;
    await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { search_history: { title: search } } }
    ).exec();
    res.send({ ok: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteSearch = async (req, res) => {
  try {
    const { title } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        search_history: { title },
      },
    });
    res.send({ ok: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const newest = async (req, res) => {
  try {
    const { skip } = req.params;
    const videos = await Video.find({})
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
    const count = await Video.count().exec();
    res.send({ videos, count });
  } catch (error) {
    res.send(error);
  }
};

export const rateVideo = async (req, res) => {
  try {
    const { videoId, rate } = req.body;
    console.log("videoId", videoId);
    console.log("rate", rate);
    const video = await Video.findById(videoId).exec()
    const alreadyVoted = video.voted.some((item) => item.user == req.user._id);
    console.log('voted', alreadyVoted)
    if (alreadyVoted) {
      await Video.updateOne(
        {_id:video._id},
        { $set: {"voted.$[u].rate": rate} },
        {arrayFilters: [{"u.user": req.user._id}]}
      ).exec()
    } else {
      await Video.findByIdAndUpdate(
        video._id,
        { $push: { voted: { user: req.user._id, rate} } },
        { new: true }
      ).exec();
    }

    res.send({ok:true});
  } catch (error) {
    res.send(error);
  }
};


export const rateSave = async (req, res) => {
  try {
    const {rate, videoId} = req.body
 await Video.findByIdAndUpdate(videoId, {rate})
  } catch (error) {
    res.send(error)
  } 
}

export const highestRated = async (req, res) => {
  try {
    const { skip } = req.params;
    const videos = await Video.find({})
      .skip(skip)
      .sort({ rate: -1 })
      .limit(20)
      .exec();
    const count = await Video.count().exec();
    res.send({ videos, count });
  } catch (error) {
    res.send(error);
  }
}