import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { RECENTLY_VIEWED_MESSAGE } from "../types/recentlyViewed.types";
import { addRecentlyViewedService, getRecentlyViewedService } from "../service/recentlyViewed.service";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const addRecentlyViewed = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await addRecentlyViewedService(
            req.user.id,
            req.params.productId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                RECENTLY_VIEWED_MESSAGE.STORED,
                null
            )
        );
    }
);

export const getRecentlyViewed = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const products = await getRecentlyViewedService(req.user.id);
        return res.status(200).json(
            new ApiResponse(
                200,
                RECENTLY_VIEWED_MESSAGE.FETCHED,
                products
            )
        );
    }
);
