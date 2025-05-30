import "../util/db.js";
import Tags from "../models/tags.js";

class tagController {
  constructor() {
    this.HOTELS = [];
  }

  getTags = async (req, res) => {
    try {
      const tags = await Tags.findAll();

      if (!tags) {
        return res.status(404).json({ message: "Tags not found" });
      }

      res.status(200).json(tags);
    } catch (err) {
      console.log("[Server]: Error getting lists", err);
      res
        .status(500)
        .json({ message: "Error getting lists", error: err.message });
    }
  };

  newTag = async (req, res) => {
    // Will add in the future
  };

  deleteTag = async (req, res) => {
    // Will add if it is helpfull
  };
}

export const TagController = new tagController();
