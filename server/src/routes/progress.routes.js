import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  getProgress,
  markSolved,
  unmarkSolved
} from "../controllers/progress.controller.js";

const router = express.Router();

// All routes require auth
router.use(requireAuth);

/* GET all progress */
router.get("/", getProgress);

/* POST mark a problem as solved */
router.post("/:problemId", markSolved);

/* DELETE progress entry (unmark this problem) */
router.delete("/:problemId", unmarkSolved);

export default router;