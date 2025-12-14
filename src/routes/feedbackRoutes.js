import express from 'express';
import { celebrate } from 'celebrate';
import {
  getLatestFeedbacks,
  createFeedback,
} from '../controllers/feedbacksController.js';
import { authenticate } from '../middleware/authenticate.js';
import { createFeedbackSchema } from '../validations/feedbackValidation.js';

const router = express.Router();

router.get('/', getLatestFeedbacks);
router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
