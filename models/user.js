import mongoose from "mongoose";
const { Schema } = mongoose;

const { ObjectId } = Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    watched_videos: [
      { video_id: {type: ObjectId, ref: "Video"}, count: {type:Number, default: 1} },
    ],
    volume: {type: String, default: 0.5}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
