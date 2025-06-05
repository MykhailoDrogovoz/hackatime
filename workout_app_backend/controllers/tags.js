import "../util/db.js";
import Tags from "../models/tags.js";
import UserExercise from "../models/userexercise.js";
import User from "../models/user.js";
import models from "../models/index.js";

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

  // completeSet = async (req, res) => {
  //   const { userId, tagId } = req.body;

  //   try {
  //     let userExercise = await UserExercise.findOne({
  //       where: { userId, tagId },
  //     });

  //     if (!userExercise) {
  //       return res.status(404).json({ message: "User exercise not found" });
  //       // userExercise = await UserExercise.create({
  //       //   userId,
  //       //   tagId,
  //       //   setsCompleted: 0,
  //       //   totalSets: 3,
  //       // });
  //     }

  //     userExercise.setsCompleted += 1;

  //     await userExercise.save();

  //     if (userExercise.setsCompleted >= userExercise.totalSets) {
  //       await this.rewardCoins(userId, tagId);
  //     }

  //     return res.status(200).json({
  //       message: "Exercise set completed successfully!",
  //       data: userExercise,
  //     });
  //   } catch (error) {
  //     console.error("Error completing set:", error);
  //     return res.status(500).json({
  //       message: "Error completing the set.",
  //       error: error.message,
  //     });
  //   }
  // };

  // rewardCoins = async (userId, tagId) => {
  //   try {
  //     const tag = await Tags.findByPk(tagId);

  //     if (!tag) {
  //       throw new Error("Tag not found.");
  //     }

  //     const user = await User.findByPk(userId);

  //     if (!user) {
  //       throw new Error("User not found.");
  //     }

  //     user.coins += 10;
  //     await user.save();

  //     await UserExercise.update(
  //       { completedAt: new Date() },
  //       { where: { userId, tagId } }
  //     );

  //     console.log("Coins rewarded to the user!");
  //   } catch (error) {
  //     console.error("Error rewarding coins:", error);
  //     throw error;
  //   }
  // };

  // getExerciseProgress = async (req, res) => {
  //   try {
  //     const { userId, tagId } = req.params;

  //     // Fetch the user's exercise entry for the specific tag (exercise)
  //     const userExercise = await models.UserExercise.findOne({
  //       where: { userId, tagId },
  //     });

  //     if (!userExercise) {
  //       return res
  //         .status(404)
  //         .json({ message: "Exercise not found for this user." });
  //     }

  //     // Fetch the tag (exercise) to get the total sets
  //     const exercise = await models.Tags.findOne({
  //       where: { tagId },
  //     });

  //     // Calculate progress
  //     const totalSets = exercise.totalSets;
  //     const setsCompleted = userExercise.setsCompleted;
  //     const progress = (setsCompleted / totalSets) * 100;

  //     // Return the progress as a response
  //     return res.json({
  //       userId,
  //       tagId,
  //       setsCompleted,
  //       totalSets,
  //       progress: Math.round(progress), // Round to the nearest integer
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res
  //       .status(500)
  //       .json({ message: "An error occurred while fetching progress." });
  //   }
  // };

  // Complete a set of exercise

  completeSet = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { setsCompleted, tagId } = req.body;

      if (!setsCompleted || setsCompleted < 1) {
        return res.status(400).json({ message: "Invalid sets completed" });
      }

      // Fetch the user's exercise entry for the specific tag (exercise)
      const [userExercise, created] = await UserExercise.findOrCreate({
        where: { userId: userId, tagId: tagId },
      });

      if (!userExercise) {
        return res
          .status(404)
          .json({ message: "User exercise entry not found." });
      }

      const exercise = await models.Tags.findByPk(tagId);

      const totalSets = exercise.totalSets;

      // Update the setsCompleted value
      const newSetsCompleted = userExercise.setsCompleted + setsCompleted;

      // Check if the user has completed all sets
      if (newSetsCompleted >= totalSets) {
        userExercise.setsCompleted = totalSets;
        userExercise.completedAt = new Date();

        return res.json({
          message: "Exercise completed!",
          coins: exercise.coins,
          setsCompleted: totalSets,
        });
      }

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

      console.log(tagName);

      // Fetch the user's exercise entry for the specific tag (exercise)
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
      const coins = req.body.coins;

      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      user.coins += coins;
      await user.save();

      console.log("[Server]: Coins rewarded to the user!");

      return res.json({
        message: "Reward claimed!",
        coins: user.coins,
      });
    } catch (error) {
      console.error("Error rewarding coins:", error);
      throw error;
    }
  };
}

export const TagController = new tagController();
