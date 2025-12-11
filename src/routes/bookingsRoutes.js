import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { createBooking } from '../controllers/bookingsController.js';
import { createBookingSchema } from '../validations/bookingValidation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: Tool booking management
 */

// Всі маршрути бронювання вимагають авторизації
router.use(authenticate);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking request for tool rental
 *     description: Create a new booking request for renting a tool with specified dates. Checks for date conflicts
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *                 example: 60d0fe4f5311236168a109cb
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Booking start date (YYYY-MM-DD)
 *                 example: "2024-12-15"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Booking end date (YYYY-MM-DD, must be after startDate)
 *                 example: "2024-12-18"
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+380501234567"
 *               deliveryCity:
 *                 type: string
 *                 example: Kyiv
 *               deliveryBranch:
 *                 type: string
 *                 example: "Main branch"
 *     responses:
 *       201:
 *         description: Booking created successfully. totalPrice calculated as days * pricePerDay
 *         content:
 *           application/json:
 *             example:
 *               _id: 60d0fe4f5311236168a109da
 *               toolId: 60d0fe4f5311236168a109cb
 *               customerId: 60d0fe4f5311236168a109ca
 *               startDate: "2024-12-15"
 *               endDate: "2024-12-18"
 *               firstName: John
 *               lastName: Doe
 *               phone: "+380501234567"
 *               deliveryCity: Kyiv
 *               deliveryBranch: Main branch
 *               totalPrice: 450
 *               status: pending
 *       400:
 *         description: Validation error - invalid dates or missing fields
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Validation failed"
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Tool not found
 *       409:
 *         description: Dates conflict - tool already booked for selected dates
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Tool is already booked for selected dates"
 */
router.post('/', celebrate(createBookingSchema), createBooking);

export default router;
