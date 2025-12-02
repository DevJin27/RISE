import express from "express";
import { getAllProblems } from "../controllers/problem.controller.js";

const router = express.Router();

/* GET all problems */
router.get("/", getAllProblems);

export default router;