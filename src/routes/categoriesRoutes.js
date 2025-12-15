import express from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (Public)
 *     description: Retrieve a list of all available tool categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *             example:
 *               status: success
 *               code: 200
 *               data:
 *                 - _id: 507f1f77bcf86cd799439013
 *                   title: Power Tools
 *                   description: Electric and battery-powered tools
 *                   keywords: drill, saw, grinder
 *                 - _id: 507f1f77bcf86cd799439014
 *                   title: Hand Tools
 *                   description: Manual tools for various tasks
 *                   keywords: hammer, screwdriver, wrench
 */
router.get('/', getCategories);

export default router;
