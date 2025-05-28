import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.post("/register", (req, res) => UserController.addUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));

router.get("/profile", verifyToken, (req, res) => {
  UserController.getUserProfile(req, res);
});

export default router;
