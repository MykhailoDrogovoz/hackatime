import Track from "../models/track.js";
import models from "../models/index.js";
import "../util/db.js";
import { Op } from "sequelize";

class trackController {
  async getAllTracks(req, res) {
    try {
      const userId = req.user.userId;
      const tracks = await Track.findAll({
        where: {
          [Op.or]: [{ isDefault: true }, { userId }],
        },
        order: [["createdAt", "DESC"]],
      });
      res.json({ success: true, tracks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }

  async addTrack(req, res) {
    const { url, type, imgUrl } = req.body;
    try {
      const track = await Track.create({
        url,
        type,
        imgUrl,
        userId: req.user.userId,
        isDefault: false,
      });
      res.json({ success: true, track });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Could not add track" });
    }
  }
}

export const TrackController = new trackController();
