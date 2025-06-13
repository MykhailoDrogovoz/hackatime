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

export default router;
