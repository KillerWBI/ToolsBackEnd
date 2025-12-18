import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createTool,
  DeleteTool,
  getAllTools,
  getToolById,
  updateTool,
} from '../controllers/controlerTools.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
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
/**
 * @swagger
 * /api/tools/{toolId}:
 *   get:
 *     summary: Get tool details by ID (Public)
 *     description: Retrieve detailed information about a specific tool including its category, feedbacks, specifications, booked dates, and average rating
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Tool details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *             example:
 *               _id: 507f1f77bcf86cd799439012
 *               owner: 507f1f77bcf86cd799439011
 *
 *               category:
 *                 _id: 507f1f77bcf86cd799439013
 *                 title: Power Tools
 *                 description: Electric and battery-powered tools
 *               name: Electric Drill XYZ-2000
 *               description: Professional electric drill with 800W motor, suitable for various materials
 *               pricePerDay: 150
 *               images: https://example.com/images/drill.jpg
 *               rating: 4.5
 *               specifications:
 *                 power: 800W
 *                 weight: 2.5kg
 *                 maxDrillDiameter: 13mm
 *               rentalTerms: Minimum rental period - 1 day. Deposit required - 500 UAH.
 *               bookedDates:
 *                 - from: "2025-12-20T00:00:00.000Z"
 *                   to: "2025-12-25T00:00:00.000Z"
 *               feedbacks:
 *                 - _id: 507f1f77bcf86cd799439015
 *                   toolId: 507f1f77bcf86cd799439012
 *                   owner: 507f1f77bcf86cd799439011
 *                   name: John Doe
 *                   description: Excellent tool! Very powerful and reliable.
 *                   rate: 5
 *                   createdAt: "2025-12-15T10:00:00.000Z"
 *               createdAt: "2025-12-15T10:00:00.000Z"
 *               updatedAt: "2025-12-15T10:00:00.000Z"
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool not found
 */
router.get('/:toolId', getToolById);
// ===== PROTECTED ROUTES =====
router.use('/', authenticate);

/**
 * @swagger
 * /api/tools:
 *   post:
 *     summary: Create a new tool (Protected)
 *     description: |
 *       Add a new tool to the platform with image uploads to Cloudinary.
 *       - Requires authentication
 *       - Tool name must be unique
 *       - Can upload 1-5 images (JPEG, PNG, WebP, GIF)
 *       - Each image max 1MB
 *       - If no images uploaded, imageUrl field is required
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - category
 *               - name
 *               - description
 *               - pricePerDay
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
 *               specifications:
 *                 type: string
 *                 description: JSON string of specifications (optional)
 *                 example: '{"power":"800W","weight":"2.5kg"}'
 *               rentalTerms:
 *                 type: string
 *                 description: Rental terms and conditions (optional)
 *                 example: Minimum rental period 1 day
 *               imageUrl:
 *                 type: string
 *                 description: Image URL (if not uploading files)
 *                 example: https://example.com/images/drill.jpg
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Tool images (1-5 files, max 1MB each). Formats - JPEG, PNG, WebP, GIF
 *     responses:
 *       201:
 *         description: Tool created successfully with images uploaded to Cloudinary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tool:
 *                   $ref: '#/components/schemas/Tool'
 *       400:
 *         description: Bad request - Validation error, missing fields, or invalid images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 value:
 *                   message: Missing required fields
 *               noImages:
 *                 value:
 *                   message: At least one image is required
 *               invalidImage:
 *                 value:
 *                   message: Error uploading images
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
router.post(
  '/',
  upload.array('images', 5),
  celebrate(createToolSchema),
  createTool
);

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
