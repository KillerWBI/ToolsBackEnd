import express from "express";
import { getLatestFeedbacks } from "../controllers/feedback.controller.js";

const router = express.Router();

router.get("/", getLatestFeedbacks);

export default router;