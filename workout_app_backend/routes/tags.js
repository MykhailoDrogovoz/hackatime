import express, { Router } from "express";
import { TagController } from "../controllers/tags.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.get("/all", (req, res) => TagController.getTags(req, res));
router.post("/complete-set", verifyToken, (req, res) =>
  TagController.completeSet(req, res)
);

router.post("/claim-reward", verifyToken, (req, res) =>
  TagController.rewardCoins(req, res)
);

router.get("/get-sets/:tagName", verifyToken, (req, res) =>
  TagController.getSets(req, res)
);

export default router;
