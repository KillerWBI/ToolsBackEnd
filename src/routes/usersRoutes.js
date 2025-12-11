import { Router } from 'express';
import { getPublicUserById, getUser } from '../controllers/usersController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/:userId', getPublicUserById);

router.get('/me', authenticate, getUser);

export default router;
