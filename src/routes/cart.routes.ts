import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addToCartSchema } from "../validators/cart.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: addToCartSchema
    }),

)

export default router;