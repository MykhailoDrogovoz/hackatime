import * as bcrypt from "bcrypt";
import "../util/db.js";
import User from "../models/user.js";

import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

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

            console.log(newUser);
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

  setCoins = async (req, res) => {
    const { coins } = req.body;
    const userId = req.user.userId;

    if (coins === undefined || coins < 0) {
      return res.status(400).json({ message: "Invalid coins value." });
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        console.log(user);

        return res.status(404).json({ message: "User not found" });
      }

      user.coins = coins;

      console.log(user);
      await user.save();

      res.status(200).json({
        message: "Coins updated successfully!",
        user: {
          id: user.id,
          coins: user.coins,
        },
      });
    } catch (error) {
      console.error("Error updating coins:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
}

export const UserController = new userController();
