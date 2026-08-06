import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createOrderSchema } from "../validators/order.validator";
import { createOrder } from "../controller/order.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: createOrderSchema
    }),
    createOrder
);
export default router;

