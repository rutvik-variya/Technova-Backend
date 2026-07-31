import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addRecentlyViewed, getRecentlyViewed } from "../controller/recentlyViewed.controller";

const router = Router();

router.post(
    "/products/:productId",
    authenticate,
    addRecentlyViewed
);

router.get(
    "/",
    authenticate,
    getRecentlyViewed
);

export default router;