import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.post("/register", (req, res) => UserController.addUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));

router.get("/profile", verifyToken, (req, res) => {
  UserController.getUserProfile(req, res);
});

router.patch("/edit", verifyToken, (req, res) => {
  UserController.editUser(req, res);
});

router.delete("/delete", verifyToken, (req, res) => {
  UserController.deleteUser(req, res);
});

router.post("/verify-email", (req, res) => {
  UserController.verifyEmail(req, res);
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

router.post("/request-password-token", (req, res) => {
  UserController.requestPasswordReset(req, res);
});

router.post("/reset-password", (req, res) => {
  UserController.resetPassword(req, res);
});

router.post("/update-user-stats", (req, res) => {
  UserController.updateUserStatsDaily(req, res);
});

router.get("/tour-status", verifyToken, (req, res) => {
  UserController.getTourStatus(req, res);
});

router.patch("/tour-status", verifyToken, (req, res) => {
  UserController.updateTourStatus(req, res);
});

export default router;
