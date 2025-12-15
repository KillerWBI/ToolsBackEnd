import express from 'express';
import { celebrate } from 'celebrate';
import {
  getLatestFeedbacks,
  createFeedback,
} from '../controllers/feedbacksController.js';
import { authenticate } from '../middleware/authenticate.js';
import { createFeedbackSchema } from '../validations/feedbackValidation.js';

const router = express.Router();

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Get latest feedbacks (Public)
 *     description: Retrieve the 10 most recent feedbacks, sorted by creation date (newest first)
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: Latest feedbacks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *             example:
 *               - _id: 507f1f77bcf86cd799439015
 *                 toolId: 507f1f77bcf86cd799439012
 *                 owner: 507f1f77bcf86cd799439011
 *                 name: John Doe
 *                 description: Great tool, works perfectly!
 *                 rate: 5
 *                 createdAt: "2025-12-15T10:00:00.000Z"
 *                 updatedAt: "2025-12-15T10:00:00.000Z"
 */
router.get('/', getLatestFeedbacks);

/**
 * @swagger
 * /api/feedbacks:
 *   post:
 *     summary: Create a feedback (Protected)
 *     description: Create a new feedback for a tool. Automatically updates the tool's average rating. Requires authentication.
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toolId
 *               - rate
 *               - description
 *             properties:
 *               toolId:
 *                 type: string
 *                 description: ID of the tool being reviewed
 *                 example: 507f1f77bcf86cd799439012
 *               rate:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *                 example: 5
 *               description:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2000
 *                 description: Feedback text
 *                 example: Excellent tool! Very powerful and easy to use.
 *     responses:
 *       201:
 *         description: Feedback created successfully. Tool rating automatically recalculated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *             example:
 *               _id: 507f1f77bcf86cd799439015
 *               toolId: 507f1f77bcf86cd799439012
 *               owner: 507f1f77bcf86cd799439011
 *               name: John Doe
 *               description: Excellent tool! Very powerful and easy to use.
 *               rate: 5
 *               createdAt: "2025-12-15T10:00:00.000Z"
 *               updatedAt: "2025-12-15T10:00:00.000Z"
 *       400:
 *         description: Validation error - Invalid rate or description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Not authenticated
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool not found
 */
router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
