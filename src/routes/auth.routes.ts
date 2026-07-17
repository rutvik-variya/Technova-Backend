import { Router } from "express";
import { register, login, logout } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

// auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

export default router;