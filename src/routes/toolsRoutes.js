import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createTool,
  DeleteTool,
  getAllNotes,
  updateTool,
} from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  createToolSchema,
  DeleteToolShema,
  updateToolSchema,
} from '../validations/toolValidation.js';

const router = Router();

// защита всех маршрутов /Tool
router.use('/Tool', authenticate);

router.get('/Tool', getAllNotes);
router.post('/Tool', celebrate(createToolSchema), createTool);
router.patch('/tools/:toolId', celebrate(updateToolSchema), updateTool);
router.delete('Tool/:id', celebrate(DeleteToolShema), DeleteTool);

export default router;
