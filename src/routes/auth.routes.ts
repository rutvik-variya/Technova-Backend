import { Router } from "express";
import { register, login, logout, getCurrentUser, changePassword } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
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


router.get(
    "/me",
    authenticate,
    getCurrentUser
);

router.patch(
    "/change-password",
    authenticate,
    validate({
        body: changePasswordSchema,
    }),
    changePassword
);

router.post("/logout", authenticate, logout);




export default router;

