import List from "../models/list.js";
import "../util/db.js";
import Tags from "../models/tags.js";
import ListTags from "../models/listtags.js";
import models from "../models/index.js";

class listController {
  constructor() {
    this.HOTELS = [];
  }

  getLists = async (req, res) => {
    try {
      const lists = await List.findAll({
        include: [
          {
            model: models.Tags,
            through: { model: models.ListTags },
          },
        ],
      });

      if (!lists) {
        return res.status(404).json({ message: "Lists not found" });
      }

      res.status(200).json(lists);
    } catch (err) {
      console.log("[Server]: Error getting lists", err);
      res
        .status(500)
        .json({ message: "Error getting lists", error: err.message });
    }
  };

  getListById = async (req, res) => {
    try {
      const list = await List.findByPk(req.params.id, {
        include: [
          {
            model: Tags,
            through: { model: ListTags },
          },
        ],
      });
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      res.status(200).json(list);
    } catch (err) {
      console.log("[Server]: Error getting list by id", err);
      res
        .status(500)
        .json({ message: "Error getting list by id", error: err.message });
    }
  };

  createList = async (req, res) => {
    try {
      const { listName, description, tags } = req.body;

      const tagIds = [];

      for (const tag of tags) {
        if (tag.tagId) {
          tagIds.push(tag.tagId);
        } else if (tag.name) {
          const [newTag, created] = await Tags.findOrCreate({
            where: { name: tag.name.trim() },
          });
          tagIds.push(newTag.tagId);
        }
      }

      const newList = await List.create({ listName, description });

      await newList.setTags(tagIds);

      const listWithTags = await List.findByPk(newList.listId, {
        include: [
          {
            model: Tags,
            attributes: ["tagId", "name"],
            through: { attributes: [] },
          },
        ],
      });

      res.status(201).json(listWithTags);
    } catch (err) {
      console.log("[Server]: Error creating new list", err);
      res
        .status(500)
        .json({ message: "Error creating new list", error: err.message });
    }
  };

  deleteList = async (req, res) => {
    try {
      const list = await List.findByPk(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      await list.destroy();
      res.status(200).json({ message: "List deleted" });
    } catch (err) {
      console.log("[Server]: Error deleting list", err);
      res
        .status(500)
        .json({ message: "Error deleting list", error: err.message });
    }
  };
}

export const ListController = new listController();
