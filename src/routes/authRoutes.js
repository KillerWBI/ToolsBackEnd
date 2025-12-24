import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
} from '../controllers/authController.js';

import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
} from '../validations/authValidation.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with name, email, and password. Email must be unique.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: SecurePass123
 *     responses:
 *       201:
 *         description: User successfully registered. Session cookies are set automatically.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=jwt_token; HttpOnly; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               _id: 507f1f77bcf86cd799439011
 *               name: John Doe
 *               email: john.doe@example.com
 *               createdAt: "2025-12-15T10:00:00.000Z"
 *               updatedAt: "2025-12-15T10:00:00.000Z"
 *       400:
 *         description: Bad request - Email already in use or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               emailInUse:
 *                 value:
 *                   message: Email in use
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: Validation failed
 */
router.post('/register', celebrate(registerUserSchema), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password. Returns user data and sets session cookies.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful. Session cookies are set.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=jwt_token; HttpOnly; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Invalid credentials
 */
router.post('/login', celebrate(loginUserSchema), loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (Protected)
 *     description: Terminate current session and clear all authentication cookies. Requires authentication.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Logout successful. All session cookies cleared.
 *       401:
 *         description: Unauthorized - Authentication required or session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Session not found
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh session
 *     description: Refresh access token using refresh token from cookies. Creates a new session.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session refreshed successfully. New tokens set in cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=new_jwt_token; HttpOnly; Path=/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session refreshed
 *       401:
 *         description: Unauthorized - Session not found or token expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               sessionNotFound:
 *                 value:
 *                   message: Session not found
 *               tokenExpired:
 *                 value:
 *                   message: Session token expired
 */
router.post('/refresh', refreshUserSession);

router.post('/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail);

export default router;
