import express, { Router } from "express";
import { ListController } from "../controllers/list.js";

const router = Router();

router.get("/all", (req, res) => ListController.getLists(req, res));
router.get("/:id", (req, res) => ListController.getListById(req, res));
router.post("/", (req, res) => ListController.createList(req, res));
router.post("/add-to-list/:id", (req, res) =>
  ListController.addTagToList(req, res)
);
router.delete("/:id", (req, res) => ListController.deleteList(req, res));

export default router;
