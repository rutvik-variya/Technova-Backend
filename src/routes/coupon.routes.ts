import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createCouponSchema, updateCouponSchema } from "../validators/coupon.validator";
import { createCoupon, deleteCoupon, updateCoupon } from "../controller/coupon.controller";

const router = Router();


// Admin Routes
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: createCouponSchema
    }),
    createCoupon
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: updateCouponSchema
    }),
    updateCoupon
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCoupon
);

export default router;