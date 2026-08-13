import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { checkoutSchema } from "../validators/checkout.validator";
import { getCheckout } from "../controller/checkout.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: checkoutSchema,
    }),
    getCheckout
);

export default router;