import { Router } from 'express';
import { getAllNotes } from '../controllers/controlerTools.js';
import { getUserTools } from '../controllers/userToolsController.js';

const router = Router();

router.get('/Tool', getAllNotes);

// Публичный endpoint для получения инструментов конкретного пользователя
router.get('/user/:userId', getUserTools);

export default router;
