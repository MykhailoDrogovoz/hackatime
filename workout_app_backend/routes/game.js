import express, { Router } from "express";
import { GameController } from "../controllers/game.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.get("/all", verifyToken, (req, res) =>
  GameController.getGames(req, res)
);
router.post("/buy-game/:gameName", verifyToken, (req, res) =>
  GameController.buyGame(req, res)
);
router.get("/get-user-options", verifyToken, (req, res) =>
  GameController.getUserGames(req, res)
);

export default router;
