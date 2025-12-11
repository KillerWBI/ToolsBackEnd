import { Router } from "express";
import { celebrate } from "celebrate";

import {
    loginUser,
    registerUser,
    logoutUser,
    refreshUserSession
} from "../controllers/authController.js";

import { loginUserSchema, registerUserSchema } from "../validations/authValidation.js";

const router = Router();

// ===== Auth routes =====
router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/api/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/api/auth/logout', logoutUser);
router.post('/api/auth/refresh', refreshUserSession);

export default router;
