import List from "../models/list.js";
import User from "../models/user.js";
import "../util/db.js";
import Tags from "../models/tags.js";
import ListTags from "../models/listtags.js";
import models from "../models/index.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";


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

   getExerciseDataFromAI = async (exerciseName) => {
    const prompt = `You are an assistant generating structured exercise metadata.

Return a strict JSON object describing the exercise "${exerciseName}" with these fields:
- "coins" (number): reward points for the exercise
- "calories" (number): estimated calories burned per set or per second if time-based
- "totalSets" (number): number of sets (total times)
- "secondsPerSet" (number): duration per set in seconds
- "totalSeconds" (number or null): total duration, if applicable (e.g., Plank)

Rules:
- Estimate calorie burn realistically:
  • Around 0.2–0.5 calories per set for light/moderate exercises.
- Do not include explanations or extra text — respond only with a JSON object.
- Ensure the response is strictly formatted as valid JSON (no comments or trailing commas).

Example:
{
  "totalSets": 30,
  "coins": 3,
  "calories": 0.3,
  "totalSeconds": null,
  "secondsPerSet": 2
}`;
  
    try {
      const token = process.env.GITHUB_API_KEY_TOKEN;
      const endpoint = "https://models.github.ai/inference";
      const modelName = "openai/gpt-4.1-mini";

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

      const response = await client.chat.completions.create({
        messages: [
          { role: "user", content: prompt },
        ],
        model: modelName,
      });
  
      const json = response.choices[0].message.content;
      console.log("Reponse: ",json)
      return JSON.parse(json);
    } catch (err) {
      console.error("[AI Error]:", err.message);
      return null;
    }
  }

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
        } else {
          // 👇 Get metadata from AI
          const aiData = await this.getExerciseDataFromAI(tag.name.trim());
    
          // Optional: validate aiData here before saving
    
          const newTag = await Tags.create({
            name: tag.name.trim(),
            totalSets: aiData?.totalSets || 0,
            coins: aiData?.coins || 0,
            calories: aiData?.calories || 0,
            totalSeconds: aiData?.totalSeconds || null,
            secondsPerSet: aiData?.secondsPerSet || 0,
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
        } else {
          console.log("sdflfjsd")
          const aiData = await this.getExerciseDataFromAI(tag.name.trim());


          const newTag = await Tags.create({
            name: tag.name.trim(),
            totalSets: aiData?.totalSets || 0,
            coins: aiData?.coins || 0,
            calories: aiData?.calories || 0,
            totalSeconds: aiData?.totalSeconds || null,
            secondsPerSet: aiData?.secondsPerSet || 0,
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
