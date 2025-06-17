import * as bcrypt from "bcrypt";
import "../util/db.js";
import User from "../models/user.js";
import Tags from "../models/tags.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import UserExercise from "../models/userexercise.js";

class userController {
  constructor() {
    this.users = [];
  }

  getUserProfile = async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          userId: req.user.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = {
        ...user.get(),
        password: undefined,
      };

      res.json({ user: userData });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  addUser(req, res) {
    const saltRounds = 10;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (username == null || email == null || password == null) {
      return res.status(400).json({ message: "Fill all required fields" });
    }
    // Use bcrypt to hash the password first
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return res.status(500).json({ message: "Error generating salt" });
      }
      console.log(
        "[Server]: Salt generation successful, proceeding to hash the password"
      );

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        }

        console.log("[Server]: Hashed password:", hash);

        // Create the new user with the hashed password
        User.create({
          username: username,
          email: email,
          password: hash,
        })
          .then((newUser) => {
            // Generate token immediately after signup
            const token = jwt.sign(
              { userId: newUser.userId },
              authConfig.secret,
              { expiresIn: "2h" }
            );

            // Send back user data and token
            res.status(201).json({
              message: "Created new user",
              newUser: newUser,
              accessToken: token,
            });

            console.log(`[Server]: ${newUser.username} signed up`);
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "Error creating user", error: err.message });
          });
      });
    });
  }

  getUser(req, res) {
    if (req.body.email == null || req.body.password == null) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    User.findOne({ where: { email: req.body.email } }).then((newUser) => {
      if (!newUser) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const storedHashedPassword = newUser.password;
      const userInputPassword = req.body.password;

      bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords: ", err);
          return;
        }

        const token = jwt.sign(
          { userId: newUser.userId },
          authConfig.secret,

          { expiresIn: "2h" }
        );

        if (result) {
          console.log(`[Server]: ${newUser.username} logged in`);
          return res.json({
            user: newUser,
            accessToken: token,
          });
        } else {
          console.log("[Server]: Passwords do not match! Auth failed.");
          res.status(401).send("Invalid credentials");
        }
      });
    });
  }

  editUser = async (req, res) => {
    try {
      if (
        (req.body.username && typeof req.body.username !== "string") ||
        (req.body.firstName && typeof req.body.firstName !== "string") ||
        (req.body.lastName && typeof req.body.lastName !== "string") ||
        (req.body.email && typeof req.body.email !== "string")
      ) {
        return res.status(400).json({ error: "Invalid types of data" });
      }

      const updatedRows = await User.update(
        {
          firstName: req.body.firstName || null,
          lastName: req.body.lastName || null,
          email: req.body.email,
          username: req.body.username,
        },
        {
          where: {
            userId: req.user.userId,
          },
        }
      );

      if (updatedRows[0] === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await User.findOne({
        where: {
          userId: req.user.userId,
        },
      });

      console.log(`[Server]: ${updatedUser.username} updated a profile`);

      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  setCoins = async (req, res) => {
    const { coins } = req.body;
    const userId = req.user.userId;

    if (coins === undefined || coins < 0) {
      return res.status(400).json({ message: "Invalid coins value." });
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.coins = coins;

      await user.save();

      res.status(200).json({
        message: "Coins updated successfully!",
        user: {
          id: user.userId,
          coins: user.coins,
        },
      });
    } catch (error) {
      console.error("Error updating coins:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  async calculateTotalCalories(userId, startDate, endDate) {
    const exercises = await UserExercise.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      include: [
        {
          model: Tags,
          attributes: ["calories"],
        },
      ],
    });

    return exercises.reduce((total, exercise) => {
      const caloriesBurned = exercise.setsCompleted * exercise.Tag.calories;
      return total + caloriesBurned;
    }, 0);
  }

  async getDailyLeaderboard(req, res) {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const users = await User.findAll();

      const leaderboard = [];
      for (const user of users) {
        const totalCalories = await this.calculateTotalCalories(
          user.userId,
          yesterday,
          new Date()
        );
        leaderboard.push({
          username: user.username,
          calories: totalCalories,
          totalTime: user.totalTime,
        });
      }

      leaderboard.sort((a, b) => b.calories - a.calories);

      res.status(200).json({ leaderboard });
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async getLastWeekLeaderboard(req, res) {
    try {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const users = await User.findAll();

      const leaderboard = [];
      for (const user of users) {
        const totalCalories = await this.calculateTotalCalories(
          user.userId,
          lastWeek,
          new Date()
        );
        leaderboard.push({
          username: user.username,
          calories: totalCalories,
          totalTime: user.totalTime,
        });
      }

      leaderboard.sort((a, b) => b.calories - a.calories);

      res.status(200).json({ leaderboard });
    } catch (error) {
      console.error("Error fetching last-week leaderboard:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async getAllTimeLeaderboard(req, res) {
    try {
      const users = await User.findAll();

      const leaderboard = [];
      for (const user of users) {
        const totalCalories = await this.calculateTotalCalories(
          user.userId,
          new Date(0),
          new Date()
        );
        leaderboard.push({
          username: user.username,
          calories: totalCalories,
          totalTime: user.totalTime,
        });
      }

      leaderboard.sort((a, b) => b.calories - a.calories);

      res.status(200).json({ leaderboard });
    } catch (error) {
      console.error("Error fetching all-time leaderboard:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async unlockFeature(req, res) {
    const { feature } = req.body;
    const FEATURE_COSTS = {
      music: 100,
      customMusic: 200,
      customLists: 100,
    };

    if (!FEATURE_COSTS[feature]) {
      return res.status(400).json({ error: "Unknown feature" });
    }

    try {
      const user = await User.findByPk(req.user.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user[feature + "Unlocked"]) {
        return res.status(400).json({ error: "Already unlocked" });
      }
      if (user.coins < FEATURE_COSTS[feature]) {
        return res.status(400).json({ error: "Not enough coins" });
      }

      user.coins -= FEATURE_COSTS[feature];
      user[feature + "Unlocked"] = true;

      await user.save();

      return res.json({
        success: true,
        coins: user.coins,
        unlockedFeature: feature,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}

export const UserController = new userController();
