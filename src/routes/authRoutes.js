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
router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

export default router;
