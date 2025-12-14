import { Router } from 'express';
import { getPublicUserById, getUser } from '../controllers/usersController.js';
import { authenticate } from '../middleware/authenticate.js';
import getUserTools from '../controllers/userToolsController.js';

const router = Router();

router.get('/me', authenticate, getUser);
router.get('/:userId', getPublicUserById);
router.get('/user/:userId', getUserTools);
export default router;
