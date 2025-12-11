import { Router } from "express";
import { celebrate } from "celebrate";

import { getAllNotes, createTool } from "../controllers/controlerTools.js";
import { createToolSchema } from "../validations/toolValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// защита всех маршрутов /Tool
router.use("/api/tools", authenticate);

router.get("/api/tools", getAllNotes);
router.post("/api/tools", celebrate(createToolSchema), createTool);

export default router;
