import * as bcrypt from "bcrypt";
import "../util/db.js";
import User from "../models/user.js";

import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

class userController {
  constructor() {
    this.users = [];
  }

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
}

export const UserController = new userController();
