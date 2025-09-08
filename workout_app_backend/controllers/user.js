import * as bcrypt from "bcrypt";
import "../util/db.js";
import User from "../models/user.js";
import Tags from "../models/tags.js";
import UserGames from "../models/usergame.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import UserStats from "../models/userstats.js";
import UserExercise from "../models/userexercise.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import List from "../models/list.js";
dotenv.config();

const emailTransporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

  verifyEmail = async (req, res) => {
    const { username, password, token } = req.body;

    try {
      const decoded = jwt.verify(token, authConfig.secret);
      const email = decoded.email;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(409).json({
          message:
            "This verification link has already been used or is no longer valid.",
        });
      }

      const newUser = await User.create({
        username,
        email,
        password,
      });

      const accessToken = jwt.sign(
        { userId: newUser.userId },
        authConfig.secret,
        { expiresIn: "2h" }
      );

      console.log(`[Server]: ${newUser.username} signed up`);

      res.status(201).json({
        message: "User created and verified successfully",
        newUser,
        token: accessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Verification failed.",
        error: err.message,
      });
    }
  };

  addUser = async (req, res) => {
    const saltRounds = 10;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (username == null || email == null || password == null) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const emailToken = jwt.sign(
      {
        email: email,
      },
      authConfig.secret,
      { expiresIn: "1h" }
    );

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

        const encodedHash = encodeURIComponent(hash);
        const verificationUrl = `${process.env.FRONTEND_URL}verify-email?token=${emailToken}&username=${username}&password=${encodedHash}`;

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Verify Your Email",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
  <h2 style="color: #333;">Hi ${username}!</h2>

  <p style="font-size: 16px; color: #555;">
    Thank you for signing up. Please verify your email address by clicking the button below:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${verificationUrl}" 
       style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
      Verify Email
    </a>
  </div>

  <p style="font-size: 14px; color: #888;">
    Or copy and paste this link into your browser:<br>
    <a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="font-size: 12px; color: #aaa;">
    If you did not request this, please ignore this email.
  </p>
</div>
`,
        };

        emailTransporter.sendMail(mailOptions);
        console.log("Registration successful, please verify your email.");
        res.status(201).json({
          message: "Registration successful, please verify your email.",
        });
      });
    });
  };

  async getUser(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    try {
      const startTotal = Date.now();

      const startDB = Date.now();
      const newUser = await User.findOne({ where: { email: req.body.email } });
      const dbDuration = Date.now() - startDB;
      console.log(`DB query duration: ${dbDuration} ms`);

      if (!newUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const startBcrypt = Date.now();
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        newUser.password
      );
      const bcryptDuration = Date.now() - startBcrypt;
      console.log(`bcrypt compare duration: ${bcryptDuration} ms`);

      if (!passwordMatch) {
        console.log("[Server]: Passwords do not match! Auth failed.");
        return res.status(401).send("Invalid credentials");
      }

      const startJWT = Date.now();
      const token = jwt.sign({ userId: newUser.userId }, authConfig.secret, {
        expiresIn: "2h",
      });
      const jwtDuration = Date.now() - startJWT;
      console.log(`JWT sign duration: ${jwtDuration} ms`);

      console.log(`[Server]: ${newUser.username} logged in`);

      const totalDuration = Date.now() - startTotal;
      console.log(`Total login duration: ${totalDuration} ms`);

      return res.json({
        user: newUser,
        accessToken: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  getTourStatus = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: ["seenNoListTour", "seenHasListTour", "seenOptionsTour"],
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json({
        seenNoListTour: user.seenNoListTour,
        seenHasListTour: user.seenHasListTour,
        seenOptionsTour: user.seenOptionsTour,
      });
    } catch (error) {
      console.error("Error in getTourStatus:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  updateTourStatus = async (req, res) => {
    try {
      const { seenNoListTour, seenHasListTour, seenOptionsTour } = req.body;

      const user = await User.findByPk(req.user.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      await user.update({
        ...(seenNoListTour !== undefined && { seenNoListTour }),
        ...(seenHasListTour !== undefined && { seenHasListTour }),
        ...(seenOptionsTour !== undefined && { seenOptionsTour }),
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in updateTourStatus:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  editUser = async (req, res) => {
    try {
      if (
        (req.body.username && typeof req.body.username !== "string") ||
        (req.body.firstName && typeof req.body.firstName !== "string") ||
        (req.body.lastName && typeof req.body.lastName !== "string") ||
        (req.body.email && typeof req.body.email !== "string") ||
        (req.body.profileImage && typeof req.body.profileImage !== "string")
      ) {
        return res.status(400).json({ error: "Invalid types of data" });
      }

      const updatedRows = await User.update(
        {
          firstName: req.body.firstName || null,
          lastName: req.body.lastName || null,
          email: req.body.email,
          username: req.body.username,
          profileImage: req.body.profileImage || null,
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
      console.error("Error updating user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
      }

      await List.destroy({
        where: { userId, access: "private" },
      });

      await UserGames.destroy({
        where: { userId },
      });

      await List.update(
        { deletedUser: true, userId: null },
        {
          where: { userId, access: "public" },
        }
      );

      const deletedRows = await User.destroy({
        where: { userId },
      });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
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

  async calculateTotalTime(userId, startDate, endDate) {
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
          attributes: ["totalSeconds", "secondsPerSet"],
        },
      ],
    });

    return exercises.reduce((total, exercise) => {
      const timePerSet = exercise.Tag.totalSeconds ?? 1;
      const sets = exercise.setsCompleted || 0;
      const time = sets * timePerSet * exercise.Tag.secondsPerSet;
      return total + time;
    }, 0);
  }

  async getDailyLeaderboard(req, res) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const users = await User.findAll();
      const leaderboard = [];

      for (const user of users) {
        const totalCalories = await this.calculateTotalCalories(
          user.userId,
          todayStart,
          todayEnd
        );

        const totalTime = await this.calculateTotalTime(
          user.userId,
          todayStart,
          todayEnd
        );

        leaderboard.push({
          username: user.username,
          profileImage: user.profileImage,
          calories: totalCalories,
          totalTime: totalTime,
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

      const stats = await UserStats.findAll({
        where: {
          date: {
            [Op.gte]: lastWeek,
            [Op.lte]: new Date(),
          },
        },
        include: [{ model: User, attributes: ["username", "profileImage"] }],
      });

      const userMap = {};

      for (const stat of stats) {
        const id = stat.userId;
        if (!userMap[id]) {
          userMap[id] = {
            username: stat.User.username,
            profileImage: stat.User.profileImage,
            calories: 0,
            totalTime: 0,
          };
        }

        userMap[id].calories += stat.calories;
        userMap[id].totalTime += stat.totalTime;
      }

      let leaderboard = Object.values(userMap).sort(
        (a, b) => b.calories - a.calories
      );

      if (leaderboard.length === 0) {
        const users = await User.findAll({
          attributes: ["username", "profileImage"],
        });

        leaderboard = users.map((user) => ({
          username: user.username,
          profileImage: user.profileImage,
          calories: 0,
          totalTime: 0,
        }));
      }

      res.status(200).json({ leaderboard });
    } catch (error) {
      console.error("Error fetching last-week leaderboard:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async getAllTimeLeaderboard(req, res) {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const users = await User.findAll({
        attributes: [
          "userId",
          "username",
          "calories",
          "totalTime",
          "profileImage",
        ],
      });

      const leaderboard = [];
      for (const user of users) {
        leaderboard.push({
          username: user.username,
          profileImage: user.profileImage,
          calories: user.calories,
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

  async updateUserStatsDaily() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const users = await User.findAll({
      attributes: ["userId", "calories", "totalTime", "profileImage"],
    });

    for (const user of users) {
      const existingStat = await UserStats.findOne({
        where: {
          userId: user.userId,
          date: yesterday,
        },
      });

      if (existingStat) {
        existingStat.calories += user.calories;
        existingStat.totalTime += user.totalTime;
        await existingStat.save();
      } else {
        await UserStats.create({
          userId: user.userId,
          date: yesterday,
          calories: user.calories,
          totalTime: user.totalTime,
        });
      }
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

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const resetToken = jwt.sign(
      {
        email: email,
      },
      authConfig.secret,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
  <h2 style="color: #333;">Hi ${user.username || "there"}!</h2>

  <p style="font-size: 16px; color: #555;">
    We received a request to reset your password. Click the button below to set a new password:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" 
       style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
      Reset Password
    </a>
  </div>

  <p style="font-size: 14px; color: #888;">
    Or copy and paste this link into your browser:<br>
    <a href="${resetLink}" style="color: #4CAF50;">${resetLink}</a>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="font-size: 12px; color: #aaa;">
    If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.
  </p>
</div>`,
    };

    try {
      user.resetToken = resetToken;
      await user.save();
      await emailTransporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Password reset link sent!" });
    } catch (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
  }

  async resetPassword(req, res) {
    const saltRounds = 10;
    const { token, password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        message: "Password must be a string.",
      });
    }

    try {
      const decoded = jwt.verify(token, authConfig.secret);

      const email = decoded.email;
      const user = await User.findOne({ where: { email } });

      if (!user || user.resetToken !== token) {
        return res
          .status(400)
          .json({ message: "Invalid reset link or token." });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
      user.resetToken = null;

      await user.save();

      return res.json({ message: "Password has been reset successfully." });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          message: "This link has expired. Please request a new one.",
        });
      }
    }
  }
}

export const UserController = new userController();
