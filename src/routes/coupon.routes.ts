import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { applyCouponSchema, createCouponSchema, updateCouponSchema } from "../validators/coupon.validator";
import { applyCoupon, createCoupon, deleteCoupon, getAdminCouponById, getAdminCoupons, removeCoupon, updateCoupon } from "../controller/coupon.controller";
import { adminCouponParamsSchema, adminCouponQuerySchema } from "../validators/adminCoupon.validator";

const router = Router();

router.post(
    "/apply",
    authenticate,
    validate({
        body: applyCouponSchema
    }),
    applyCoupon
);

router.delete(
    "/remove",
    authenticate,
    removeCoupon
);

// Admin Routes

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    validate({ query: adminCouponQuerySchema }),
    getAdminCoupons
);

router.get(
    "/admin/:couponId",
    authenticate,
    authorize("ADMIN"),
    validate({ params: adminCouponParamsSchema }),
    getAdminCouponById
);

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