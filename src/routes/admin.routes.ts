import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getAdminDashboard, getAdminDashboardSales } from "../controller/adminDashboard.controller";
import { adminDashboardSalesSchema } from "../validators/adminDashboard.validator";
import validate from "../middleware/validate.middleware";
import { adminUsersQuerySchema } from "../validators/adminUser.validator";
import { getAdminUserById, getAdminUsers } from "../controller/adminUser.controller";
import { getAdminShippingMethods, updateAdminShippingMethod } from "../controller/adminShipping.controller";
import { adminShippingMethodParamSchema, adminShippingUpdateSchema } from "../validators/adminShipping.validator";


const router = Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    getAdminDashboard
);

router.get(
    "/dashboard/sales",
    authenticate,
    authorize("ADMIN"),
    validate({
        query: adminDashboardSalesSchema,
    }),
    getAdminDashboardSales
);


router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    validate({
        query: adminUsersQuerySchema,
    }),
    getAdminUsers
);

router.get(
    "/users/:userId",
    authenticate,
    authorize("ADMIN"),
    getAdminUserById
)

router.get(
    "/shipping",
    authenticate,
    authorize("ADMIN"),
    getAdminShippingMethods
);

router.patch(
    "/shipping/:method",
    authenticate,
    authorize("ADMIN"),
    validate({
        params: adminShippingMethodParamSchema,
        body: adminShippingUpdateSchema,
    }),
    updateAdminShippingMethod
);

export default router;