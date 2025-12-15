import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { createBooking } from '../controllers/bookingsController.js';
import { createBookingSchema } from '../validations/bookingValidation.js';

const router = Router();

// Всі маршрути бронювання вимагають авторизації
router.use(authenticate);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking request (Protected)
 *     description: Create a new booking request for renting a tool with specified dates. Automatically checks for date conflicts and calculates total price based on rental duration.
 *     tags: [Bookings]
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
 *               - startDate
 *               - endDate
 *               - firstName
 *               - lastName
 *               - phone
 *               - deliveryCity
 *               - deliveryBranch
 *             properties:
 *               toolId:
 *                 type: string
 *                 description: ID of the tool to book
 *                 example: 507f1f77bcf86cd799439012
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Booking start date (YYYY-MM-DD). Cannot be in the past.
 *                 example: "2025-12-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Booking end date (YYYY-MM-DD). Must be after or equal to startDate.
 *                 example: "2025-12-25"
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Customer first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Customer last name
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 description: Customer phone number
 *                 example: "+380501234567"
 *               deliveryCity:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Delivery city
 *                 example: Kyiv
 *               deliveryBranch:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Delivery branch or address
 *                 example: "Main branch, Khreshchatyk St. 1"
 *     responses:
 *       201:
 *         description: Booking created successfully. Total price is calculated automatically as (number of days × pricePerDay).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               _id: 507f1f77bcf86cd799439014
 *               toolId: 507f1f77bcf86cd799439012
 *               userId: 507f1f77bcf86cd799439011
 *               firstName: John
 *               lastName: Doe
 *               phone: "+380501234567"
 *               startDate: "2025-12-20T00:00:00.000Z"
 *               endDate: "2025-12-25T00:00:00.000Z"
 *               totalPrice: 750
 *               deliveryCity: Kyiv
 *               deliveryBranch: "Main branch, Khreshchatyk St. 1"
 *               status: pending
 *               createdAt: "2025-12-15T10:00:00.000Z"
 *               updatedAt: "2025-12-15T10:00:00.000Z"
 *       400:
 *         description: Validation error - Invalid dates, missing fields, or date format error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               pastDate:
 *                 value:
 *                   statusCode: 400
 *                   message: Validation failed
 *                   validation:
 *                     body:
 *                       message: '"startDate" Start date cannot be in the past'
 *               invalidDateRange:
 *                 value:
 *                   statusCode: 400
 *                   message: Validation failed
 *                   validation:
 *                     body:
 *                       message: '"endDate" End date cannot be before start date'
 *       401:
 *         description: Unauthorized - User not authenticated
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
 *       409:
 *         description: Conflict - Tool already booked for selected dates
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tool is already booked for the selected dates. Please choose another date range.
 */
router.post('/', celebrate(createBookingSchema), createBooking);

export default router;
