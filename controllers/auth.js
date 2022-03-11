import User from "../models/user";
import Video from '../models/video'
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const existing = await User.findOne({ email }).exec();
    if (existing) return res.status(400).send("User already exist");

    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    console.log("user", user);

    return res.send(user);
  } catch (error) {
    return res.send(error);
  }
};

export const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    const passwordOk = await comparePassword(password, user.password);

    if (passwordOk) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      user.password = undefined;
      res.cookie("token", token, { httpOnly: true });
      res.send(user);
    } else {
      res.status(403).send("Email or password error");
    }
  } catch (error) {
    console.log(error);
  }
};

export const currentUser = async (req, res) => {
  try {
    if (req.user._id != null) {
      const user = await User.findById(req.user._id).select("-password").exec();
      res.send(user);
    } else {
      res.status(403).send("User not authorized");
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

export const incrementViewsCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.body;
    const user = await User.findById(req.user._id)
      .select("watched_videos")
      .exec();
    if (
      !user.watched_videos.some((v) => v.video_id.toString() === id.toString())
    ) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watched_videos: { video_id: id, count: 1 } },
      }).exec();
    } else {
      console.log("elseee");
      await User.findOneAndUpdate(
        { _id: userId, "watched_videos.video_id": id },
        { $inc: { "watched_videos.$.count": 1 } }
      ).exec();
    }

    await Video.findByIdAndUpdate(id, {$inc: {'viewCount': 1}})
    res.send({ ok: true });
  } catch (error) {
    res.status(400).send(error);
  }
};


export const editUser = async (req, res) => {
  try {
    const {volume} = req.body
    console.log('volume',volume)
  await User.findByIdAndUpdate(req.user._id, {volume}).exec()
  res.send({ok:true})

  } catch (error) {
    res.status(400).send(error)
  }
}