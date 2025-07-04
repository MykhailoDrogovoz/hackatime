import "../util/db.js";
import Tags from "../models/tags.js";
import UserExercise from "../models/userexercise.js";
import User from "../models/user.js";
import models from "../models/index.js";
import { Op } from "sequelize";

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

  completeSet = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { setsCompleted, tagId } = req.body;

      if (!setsCompleted || setsCompleted < 1) {
        return res.status(400).json({ message: "Invalid sets completed" });
      }

      const [userExercise, created] = await UserExercise.findOrCreate({
        where: { userId: userId, tagId: tagId },
        defaults: {
          rewardClaimed: false, 
        },
      });

      if (!userExercise) {
        return res
          .status(404)
          .json({ message: "User exercise entry not found." });
      }

      if (userExercise.rewardClaimed){
        return res.json({ message: "Reward is already claimed." });
      }

      const user = await models.User.findByPk(userId);

      const exercise = await models.Tags.findByPk(tagId);

      const totalSets = exercise.totalSets;

      const newSetsCompleted = userExercise.setsCompleted + setsCompleted;

      if (exercise.totalSeconds) {
        console.log("ajsdlkaklsjdlajsjdl", userExercise.rewardClaimed);
        if (newSetsCompleted >= exercise.totalSeconds * exercise.totalSets) {
          user.calories =
            Number(user.calories) + setsCompleted * Number(exercise.calories);
          user.totalTime =
            user.totalTime + setsCompleted * exercise.secondsPerSet;
          await user.save();

          userExercise.setsCompleted = newSetsCompleted;
          userExercise.completedAt = new Date();
          await userExercise.save();

          return res.json({
            message: "Exercise completed!",
            coins: exercise.coins,
            setsCompleted: totalSets,
          });
        }
      } else {
        if (newSetsCompleted >= totalSets) {
          user.calories =
            Number(user.calories) + setsCompleted * Number(exercise.calories);
          user.totalTime =
            user.totalTime + setsCompleted * exercise.secondsPerSet;

          await user.save();

          userExercise.setsCompleted = totalSets;
          userExercise.completedAt = new Date();
          await userExercise.save();

          return res.json({
            message: "Exercise completed!",
            coins: exercise.coins,
            setsCompleted: totalSets,
          });
        }
      }
      console.log("ajsdlkaklsjdlajsjdl", userExercise.rewardClaimed);

      user.totalTime = user.totalTime + setsCompleted * exercise.secondsPerSet;

      user.calories =
        Number(user.calories) + Number(exercise.calories) * setsCompleted;

      await user.save();

      userExercise.setsCompleted = newSetsCompleted;
      await userExercise.save();

      return res.json({
        message: "Progress updated!",
        setsCompleted: newSetsCompleted,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while completing the set." });
    }
  };

  getSets = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { tagName } = req.params;

      const tag = await Tags.findOne({
        where: { name: tagName },
      });

      const userExercise = await UserExercise.findOne({
        where: { userId: userId, tagId: tag.tagId },
      });

      if (!userExercise) {
        return res.status(200).json({ userExercise: 0 });
      }

      return res.json({
        userExercise: userExercise,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while completing the set." });
    }
  };

  rewardCoins = async (req, res) => {
    try {
      const { coins, tagId } = req.body;
      const userId = req.user.userId;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const userExercise = await UserExercise.findOne({
        where: { userId, tagId },
      });

      if (!userExercise) {
        return res.status(404).json({ error: "Exercise not found." });
      }

      if (userExercise.rewardClaimed) {
        return res.status(400).json({ error: "Reward already claimed." });
      }

      user.coins += coins;
      await user.save();
      console.log(userExercise.rewardClaimed);
      console.log(
        "RewardClaimed Type:",
        typeof userExercise.rewardClaimed,
        userExercise.rewardClaimed
      );
      userExercise.rewardClaimed = true;
      await userExercise.save();

      return res.json({
        message: "Reward claimed!",
        coins: user.coins,
      });
    } catch (error) {
      console.error("Error rewarding coins:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  };

  getUserExercisesByUserId = async (req, res) => {
    try {
      const userId = req.user.userId;

      const userExercises = await UserExercise.findAll({
        where: { userId: userId, completedAt: { [Op.ne]: null } },
      });

      if (!userExercises) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.json({
        userExercises: userExercises,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while completing the set." });
    }
  };
}

export const TagController = new tagController();
