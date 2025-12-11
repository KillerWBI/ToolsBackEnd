import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createTool, getAllNotes } from '../controllers/controlerTools.js';
import { createToolSchema } from '../validations/toolValidation.js';

const router = Router();

router.get('/Tool', getAllNotes);
router.post('/Tool', celebrate(createToolSchema), createTool);

export default router;
