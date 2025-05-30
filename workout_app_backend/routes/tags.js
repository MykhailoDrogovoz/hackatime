import express, { Router } from "express";
import { TagController } from "../controllers/tags.js";

const router = Router();

router.get("/all", (req, res) => TagController.getTags(req, res));

export default router;
