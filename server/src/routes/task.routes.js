import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { listTasks, createTask, deleteTask, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
