import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { mentorController } from "../controllers/mentor.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", mentorController.handleMentorQuery);

export default router;
