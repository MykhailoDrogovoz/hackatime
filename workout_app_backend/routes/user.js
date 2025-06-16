import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.post("/register", (req, res) => UserController.addUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));

router.get("/profile", verifyToken, (req, res) => {
  UserController.getUserProfile(req, res);
});

router.post("/update-coins", verifyToken, (req, res) => {
  UserController.setCoins(req, res);
});

router.get("/leaderboard", (req, res) =>
  UserController.getCaloriesTime(req, res)
);

router.get("/leaderboard/daily", (req, res) =>
  UserController.getDailyLeaderboard(req, res)
);

router.get("/leaderboard/last-week", (req, res) =>
  UserController.getLastWeekLeaderboard(req, res)
);

router.get("/leaderboard/all-time", (req, res) =>
  UserController.getAllTimeLeaderboard(req, res)
);

router.post("/unlock-feature", verifyToken, (req, res) =>
  UserController.unlockFeature(req, res)
);

export default router;
