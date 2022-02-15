import Playlist from "../models/playlist";
import User from "../models/user";

export const addPlaylist = async (req, res) => {
  try {
    const newPlaylist = await new Playlist({
      owner: req.user._id,
      name: req.body.name,
    }).save();
    res.send(newPlaylist);
  } catch (error) {
    res.status(400).send("Error making playlist");
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).exec();
    res.send(playlists);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPlaylistVideos = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.body.playlist).populate('videos').exec();
    if (playlist.owner._id != req.user._id) {
      return res
        .status(400)
        .send("You are no authorized to view this playlist!");
    } else {
      return res.send(playlist.videos);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const addVideosToPlaylist = async (req, res) => {
  try {
    const { arrOfSelected, id } = req.body;
    console.log(arrOfSelected);
    console.log(id);
    const playlist = await Playlist.findById(id).exec();
    if (playlist.owner._id != req.user._id) {
      return res.sendStatus(403);
    } else {
      await Playlist.findByIdAndUpdate(id, {
        $addToSet: { videos: arrOfSelected },
      }).exec();
      res.send({ok:true})
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
