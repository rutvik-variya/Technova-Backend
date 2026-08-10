import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createOrderSchema, getOrderSchema } from "../validators/order.validator";
import { createOrder, getMyOrders, getOrder} from "../controller/order.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: createOrderSchema
    }),
    createOrder
);

router.get(
    "/",
    authenticate,
    getMyOrders
);

router.get(
    "/:orderId",
    authenticate,
    validate({
        params: getOrderSchema,
    }),
    getOrder
)


export default router;

