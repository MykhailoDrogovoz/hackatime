import List from "../models/list.js";
import User from "../models/user.js";
import "../util/db.js";
import Tags from "../models/tags.js";
import ListTags from "../models/listtags.js";
import models from "../models/index.js";
import { Op } from "sequelize";

class listController {
  constructor() {
    this.HOTELS = [];
  }

  getLists = async (req, res) => {
    try {
      if (req.user == null) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      const lists = await List.findAll({
        where: {
          [Op.or]: [
            {
              access: {
                [Op.eq]: "public",
              },
            },
            {
              userId: {
                [Op.eq]: userId,
              },
            },
          ],
        },
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

      res.status(200).json({ lists, user });
    } catch (err) {
      console.log("[Server]: Error getting lists", err);
      res
        .status(500)
        .json({ message: "Error getting lists", error: err.message });
    }
  };

  getListById = async (req, res) => {
    try {
      const list = await List.findOne({
        where: {
          listId: req.params.id,
        },
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

      res.status(200).json({ list, userId: req.user.userId });
    } catch (err) {
      console.log("[Server]: Error getting list by id", err);
      res
        .status(500)
        .json({ message: "Error getting list by id", error: err.message });
    }
  };

  createList = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { listName, description, access, tags } = req.body;

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

      const newList = await List.create({
        listName,
        description,
        access,
        userId,
      });

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

  addTagToList = async (req, res) => {
    try {
      const list = await List.findByPk(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      console.log(req.body.name);

      const [newTag, created] = await Tags.findOrCreate({
        where: { name: req.body.tag.trim() },
      });

      if (!newTag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      await list.addTag(newTag);

      const updatedList = await List.findByPk(req.params.id, {
        include: [
          {
            model: Tags,
            through: { model: ListTags },
          },
        ],
      });
      res.status(201).json(updatedList);
    } catch (err) {
      console.log("[Server]: Error adding tag to list", err);
      res
        .status(500)
        .json({ message: "Error adding tag to list", error: err.message });
    }
  };

  updateList = async (req, res) => {
    const userId = req.user.userId;

    const { listName, description, access, tags } = req.body;

    try {
      const list = await List.findOne({
        where: {
          listId: req.params.id,
        },
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

      if (userId !== list.userId) {
        return res
          .status(404)
          .json({ message: "You do not have permission to update this list" });
      }

      if (listName) list.listName = listName;
      if (description) list.description = description;
      if (access) list.access = access;

      await list.save();

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

      if (tagIds) {
        await list.setTags(tagIds);
      }

      res.status(200).json(list);
    } catch (err) {
      console.log("[Server]: Error updating list", err);
      res
        .status(500)
        .json({ message: "Error updating list", error: err.message });
    }
  };
}

export const ListController = new listController();
