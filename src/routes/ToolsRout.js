import { Router } from 'express';
import { createTool, getAllNotes } from '../controllers/controlerTools.js';

const router = Router();

router.get('/Tool', getAllNotes);
router.post('/Tool', createTool);

export default router;
