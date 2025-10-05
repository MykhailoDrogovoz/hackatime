import jwt from "jsonwebtoken";
import redisClient from "../util/redisClient.js";
import authConfig from "../config/auth.config.js";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  const headerToken =
    req.headers["x-access-token"] || req.headers["authorization"];

  if (!headerToken) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const token = headerToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    const userId = decoded.userId;

    // Try to get user from Redis cache
    const cachedUser = await redisClient.get(`user:${userId}`);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // Cache miss — fetch user from DB
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found" });
    }

    // Cache user data in Redis with TTL (e.g., 2 hours)
    await redisClient.setEx(
      `user:${userId}`,
      2 * 60 * 60,
      JSON.stringify(user)
    );

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Unauthorized!", error: err.message });
  }
};
