import express from "express";
import { signinUser, signupUser,getCurrentUser } from "../controllers/authController.js";
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
