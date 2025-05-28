import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
// import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/register", (req, res) => UserController.addUser(req, res));

export default router;
