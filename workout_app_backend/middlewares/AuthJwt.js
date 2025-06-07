import jwt from "jsonwebtoken";
import db from "../util/db.js";
import authConfig from "../config/auth.config.js";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  const headerToken =
    req.headers["x-access-token"] || req.headers["authorization"];
  const token = headerToken.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);

    req.user = req.user || {};
    req.user.userId = decoded.userId;

    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found" });
    }

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
