import { Router } from "express";
import { getPublicUserById } from "../controllers/usersController.js";

const router = Router();

router.get("/api/users/:userId", getPublicUserById);

export default router;
