import express, { Router } from "express";
import { TrackController } from "../controllers/track.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.get("/", verifyToken, (req, res) =>
  TrackController.getAllTracks(req, res)
);
router.post("/", verifyToken, (req, res) => TrackController.addTrack(req, res));

export default router;
