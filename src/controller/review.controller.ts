import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

import { REVIEW_MESSAGE } from "../types/review.types";
import { createReviewService, deleteReviewService, getReviewsService, updateReviewService } from "../service/review.service";

interface AuthenticatedRequest extends Request {
    user: { id: string };
}

export const createReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const review = await createReviewService(
            req.params.productId as string,
            req.user.id as string,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                REVIEW_MESSAGE.CREATED,
                review
            )
        );
    }
);

export const getReviews = asyncHandler(
    async (req: Request, res: Response) => {

        const reviews = await getReviewsService(
            req.params.productId as string,
            req.query
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                REVIEW_MESSAGE.FETCHED,
                reviews
            )
        );
    }
);

export const updateReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const review = await updateReviewService(
            req.params.id as string,
            req.user,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                REVIEW_MESSAGE.UPDATED,
                review
            )
        );
    }
);

export const deleteReview = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await deleteReviewService(
            req.params.id as string,
            req.user
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                REVIEW_MESSAGE.DELETED,
                null
            )
        );
    }
)