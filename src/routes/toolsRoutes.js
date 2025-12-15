import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createTool,
  DeleteTool,
  getAllTools,
  updateTool,
} from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  createToolSchema,
  DeleteToolShema,
  updateToolSchema,
} from '../validations/toolValidation.js';

const router = Router();

/**
 * @swagger
 * /api/tools:
 *   get:
 *     summary: Get all tools (Public)
 *     description: Retrieve a paginated list of all available tools with optional filtering by search query and category
 *     tags: [Tools]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 16
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search query (searches in name, description, category)
 *         example: drill
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID(s). Multiple IDs can be comma-separated
 *         example: 507f1f77bcf86cd799439013,507f1f77bcf86cd799439014
 *     responses:
 *       200:
 *         description: List of tools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 limit:
 *                   type: integer
 *                   example: 16
 *                 totalTools:
 *                   type: integer
 *                   example: 78
 *                 tools:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tool'
 */
router.get('/', getAllTools);

// ===== PROTECTED ROUTES =====
router.use('/', authenticate);

/**
 * @swagger
 * /api/tools:
 *   post:
 *     summary: Create a new tool (Protected)
 *     description: Add a new tool to the platform. Requires authentication. Tool name must be unique.
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - category
 *               - name
 *               - description
 *               - pricePerDay
 *               - images
 *             properties:
 *               owner:
 *                 type: string
 *                 description: User ID of the tool owner
 *                 example: 507f1f77bcf86cd799439011
 *               category:
 *                 type: string
 *                 description: Category ID
 *                 example: 507f1f77bcf86cd799439013
 *               name:
 *                 type: string
 *                 description: Tool name (must be unique)
 *                 example: Electric Drill XYZ-2000
 *               description:
 *                 type: string
 *                 description: Detailed tool description
 *                 example: Professional electric drill with 800W motor
 *               pricePerDay:
 *                 type: number
 *                 minimum: 0
 *                 description: Daily rental price
 *                 example: 150
 *               images:
 *                 type: string
 *                 description: Image URL or path
 *                 example: https://example.com/images/drill.jpg
 *               specifications:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 description: Tool specifications (optional)
 *                 example:
 *                   power: 800W
 *                   weight: 2.5kg
 *               rentalTerms:
 *                 type: string
 *                 description: Rental terms and conditions (optional)
 *                 example: Minimum rental period 1 day
 *     responses:
 *       201:
 *         description: Tool created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tool:
 *                   $ref: '#/components/schemas/Tool'
 *       400:
 *         description: Bad request - Validation error or empty request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               emptyBody:
 *                 value:
 *                   message: Request body is empty
 *               missingFields:
 *                 value:
 *                   message: Missing required fields
 *               emptyName:
 *                 value:
 *                   message: Name cannot be empty
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Tool with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool with this name already exists
 */
router.post('/', celebrate(createToolSchema), createTool);

/**
 * @swagger
 * /api/tools/{toolId}:
 *   patch:
 *     summary: Update tool (Protected)
 *     description: Update tool information. Requires authentication.
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *         example: 507f1f77bcf86cd799439012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Tool Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               pricePerDay:
 *                 type: number
 *                 example: 200
 *               images:
 *                 type: string
 *                 example: https://example.com/new-image.jpg
 *               specifications:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               rentalTerms:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool not found
 */
router.patch('/:toolId', celebrate(updateToolSchema), updateTool);

/**
 * @swagger
 * /api/tools/{toolId}:
 *   delete:
 *     summary: Delete tool (Protected)
 *     description: Delete a tool. Only the owner can delete their tool. Requires authentication.
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tool deleted successfully
 *                 deleted:
 *                   $ref: '#/components/schemas/Tool'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - You are not the owner of this tool
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: You are not the owner of this tool
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool not found
 */
router.delete('/:toolId', celebrate(DeleteToolShema), DeleteTool);

export default router;
