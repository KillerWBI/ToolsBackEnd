import express from "express";
import { getLatestFeedbacks } from "../controllers/feedbacksController.js";

const router = express.Router();

router.get("/", getLatestFeedbacks);

export default router;