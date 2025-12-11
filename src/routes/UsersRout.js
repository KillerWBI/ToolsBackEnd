import { Router } from 'express';
import { getPublicUserById, getUser } from '../controllers/usersController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/api/users/:userId', getPublicUserById);

router.get('/api/users/me', authenticate, getUser);

export default router;
