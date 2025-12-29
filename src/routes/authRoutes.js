import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
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

/**
 * @swagger
 * /api/auth/request-reset-email:
 *   post:
 *     summary: Request password reset email
 *     description: Send a password reset link to the user's email address. The link contains a JWT token valid for 15 minutes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Reset email sent successfully (or email not found - same response for security)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: If this email exists, a reset link has been sent
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error - Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Failed to send the email, please try again later.
 */
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     description: Reset user password using the token received via email. Token is valid for 15 minutes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT reset token from email link
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 description: New password
 *                 example: NewSecurePass123
 *     responses:
 *       200:
 *         description: Password reset successful. All user sessions are terminated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been successfully reset
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               tokenExpired:
 *                 value:
 *                   message: Reset token has expired
 *               invalidToken:
 *                 value:
 *                   message: Invalid reset token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: User not found
 */
router.post('/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
