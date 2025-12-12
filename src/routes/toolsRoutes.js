import { celebrate } from 'celebrate';
import { Router } from 'express';

import { createTool, DeleteTool, getAllNotes, updateTool } from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import { createToolSchema, DeleteToolShema, UpdateTollSchema } from '../validations/toolValidation.js';

const router = Router();

// ===== PUBLIC ROUTE =====
router.get("/tool", getAllNotes);

// ===== PROTECTED ROUTES =====
router.use("/tool", authenticate);

router.post("/tool", celebrate(createToolSchema), createTool);
router.patch("/tool/:toolId", celebrate(UpdateTollSchema), updateTool);
router.delete("/tool/:toolId", celebrate(DeleteToolShema), DeleteTool);

export default router;
