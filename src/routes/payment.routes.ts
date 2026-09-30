import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";

import {
    createOnlinePaymentSchema,
    createPaymentSchema,
    verifyPaymentSchema,
} from "../validators/payment.validator";

import {
    createOnlinePayment,
    createPayment,
    verifyPayment,
} from "../controller/payment.controller";

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
    "/online",
    authenticate,
    validate({
        body: createOnlinePaymentSchema,
    }),
    createOnlinePayment
);

router.post(
    "/:paymentId/verify",
    authenticate,
    validate({
        body: verifyPaymentSchema,
    }),
    verifyPayment
);

export default router;