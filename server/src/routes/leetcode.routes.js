import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { validateUsername, validateProblemSlug } from "../middleware/validators.js";
import { initialSync } from "../controllers/leetcodeSync.controller.js";
import { LeetCodeClient } from '../clients/leetcodeClient.js';

const router = express.Router();

// attach lc client
router.use((req, res, next) => {
  const cookie = req.headers["x-leetcode-session"];
  req.leetcodeClient = new LeetCodeClient({ cookie });
  next();
});

// public endpoints
router.get("/users/:username/profile", validateUsername, async (req, res) => {
  const data = await req.leetcodeClient.getUserProfile(req.params.username);
  res.json({ success: true, data });
});

// sync
router.post(
  "/users/:username/initial-sync",
  requireAuth,
  validateUsername,
  initialSync
);

export default router;