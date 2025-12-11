import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotes,
  createTool,
  getToolById,
  updateTool,
} from '../controllers/controlerTools.js';
import {
  createToolSchema,
  updateToolSchema,
} from '../validations/toolValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// защита всех маршрутов /Tool
router.use('/Tool', authenticate);

router.get('/Tool:toolId', getToolById);
router.get('/Tool', getAllNotes);
router.post('/Tool', celebrate(createToolSchema), createTool);

router.patch('/tools/:toolId', celebrate(updateToolSchema), updateTool);

export default router;
