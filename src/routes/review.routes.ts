import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createReviewSchema, updateReviewSchema } from "../validators/review.validator";
import { createReview, deleteReview, getReviews, updateReview } from "../controller/review.controller";

const router = Router();

router.post(
    "/:productId",
    authenticate,
    validate({
        body: createReviewSchema
    }),
    createReview
)

router.get(
    "/:productId",
    getReviews
);

router.patch(
    "/:id",
    authenticate,
    validate({
        body: updateReviewSchema
    }),
    updateReview
)

router.delete(
    "/:id",
    authenticate,
    deleteReview
);
export default router;