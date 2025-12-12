import { celebrate } from 'celebrate';
import { Router } from 'express';

import { createTool, DeleteTool, getAllNotes, updateTool } from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import { createToolSchema, DeleteToolShema, UpdateTollSchema } from '../validations/toolValidation.js';

const router = Router();

// ===== PUBLIC ROUTE =====
router.get("/Tool", getAllNotes);

// ===== PROTECTED ROUTES =====
router.use("/Tool", authenticate);

router.post("/Tool", celebrate(createToolSchema), createTool);
router.patch("/Tool/:toolId", celebrate(UpdateTollSchema), updateTool);
router.delete("/Tool/:toolId", celebrate(DeleteToolShema), DeleteTool);

export default router;
