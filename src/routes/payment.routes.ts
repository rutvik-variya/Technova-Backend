import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createPaymentSchema } from "../validators/payment.validator";
import { createPayment, verifyPayment } from "../controller/payment.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: createPaymentSchema,
    }),
    createPayment
);

router.post(
    "/:paymentId/verify",
    authenticate,
    verifyPayment
);


export default router;
