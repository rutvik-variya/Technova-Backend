import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { adminGetOrdersSchema, cancelOrderSchema, createOrderSchema, getOrderSchema, getOrderStatusHistorySchema, updateOrderStatusBodySchema, updateOrderStatusParamsSchema }
    from "../validators/order.validator";
import { cancelOrder, createOrder, getAllOrders, getMyOrders, getOrder, getOrderStatusHistory, updateOrderStatus, } from "../controller/order.controller";

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


router.patch(
    "/:orderId/cancel",
    authenticate,
    validate({
        params: cancelOrderSchema,
    }),
    cancelOrder
);

//Admin Routes :
router.get(
    "/admin/getAllOrders",
    authenticate,
    authorize("ADMIN"),
    validate({
        query: adminGetOrdersSchema
    }),
    getAllOrders
)

router.patch(
    "/admin/:orderId/status",
    authenticate,
    authorize("ADMIN"),
    validate({
        params: updateOrderStatusParamsSchema,
        body: updateOrderStatusBodySchema
    }),
    updateOrderStatus
);

router.get(
    "/admin/:orderId/timeline",
    authenticate,
    authorize("ADMIN"),
    validate({
        params: getOrderStatusHistorySchema
    }),
    getOrderStatusHistory
)

export default router;

