import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createTool,
  DeleteTool,
  getAllTools,
  updateTool,
} from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  createToolSchema,
  DeleteToolShema,
  updateToolSchema,
} from '../validations/toolValidation.js';

const router = Router();

// ===== PUBLIC ROUTE =====
router.get("/", getAllTools);

// ===== PROTECTED ROUTES =====
router.use("/", authenticate);

router.post("/", celebrate(createToolSchema), createTool);
router.patch("/:toolId", celebrate(updateToolSchema), updateTool);
router.delete("/:toolId", celebrate(DeleteToolShema), DeleteTool);

export default router;
