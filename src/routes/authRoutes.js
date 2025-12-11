import { Router } from "express";
import { celebrate } from "celebrate";
import {
    loginUser,
    registerUser,
    logoutUser,
    refreshUserSession
 } from "../controllers/authController.js";


const router = Router();

router.post('/auth/register', celebrate(), registerUser);
router.post('/auth/login', celebrate(), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

export default router;