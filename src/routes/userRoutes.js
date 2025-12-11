import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getUser } from '../controllers/userController.js';

const router = Router();

router.get('/api/users/me', authenticate, getUser);

export default router;
