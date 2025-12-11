import { Router } from 'express';
import { getPublicUserById } from '../controllers/usersController.js';
import getUserTools from '../controllers/userToolsController.js';

const router = Router();

// Публичный пользователь
router.get('/:userId', getPublicUserById);

// Инструменты пользователя
router.get('/:userId/tools', getUserTools);

export default router;
