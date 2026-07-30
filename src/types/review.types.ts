import { z } from "zod";
import { createReviewSchema, updateReviewSchema } from "../validators/review.validator";

export type createReviewDto = z.infer<
    typeof createReviewSchema
>;

export type updateReviewDto = z.infer<
    typeof updateReviewSchema
>;

export const REVIEW_MESSAGE = {
    CREATED: "Review added successfully",
    FETCHED: "Reviews fetched successfully",
    UPDATED: "Review updated successfully",
    DELETED: "Review deleted successfully",

    NOT_FOUND: "Review not found",
    PRODUCT_NOT_FOUND: "Product not found",
    ALREADY_REVIEWED: "You have already reviewed this product",
    UNAUTHORIZED: "You are not authorized to perform this action",
};