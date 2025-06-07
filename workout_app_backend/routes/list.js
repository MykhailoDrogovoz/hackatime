import express, { Router } from "express";
import { ListController } from "../controllers/list.js";
import { verifyToken } from "../middlewares/AuthJwt.js";

const router = Router();

router.get("/all", verifyToken, (req, res) =>
  ListController.getLists(req, res)
);
router.get("/:id", verifyToken, (req, res) =>
  ListController.getListById(req, res)
);
router.post("/", verifyToken, (req, res) =>
  ListController.createList(req, res)
);
router.post("/add-to-list/:id", (req, res) =>
  ListController.addTagToList(req, res)
);
router.delete("/:id", (req, res) => ListController.deleteList(req, res));
router.patch("/:id", verifyToken, ListController.updateList);

export default router;
