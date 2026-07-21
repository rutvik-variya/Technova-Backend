import { Router } from "express";
import { register, login, logout, test } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import {
    registerSchema,
    loginSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/register",
    validate({
        body: registerSchema,
    }),
    register
);

router.post(
    "/login",
    validate({
        body: loginSchema,
    }),
    login
);

router.post("/logout", authenticate, logout);

router.get("/test", authenticate, authorize("ADMIN"), test)

export default router;