import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { getShippingMethods } from "../controller/shipping.controller";

const router = Router();

router.get(
    "/method",
    authenticate,
    getShippingMethods
);

export default router;