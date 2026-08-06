import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { WISHLIST_MESSAGE } from "../types/wishlist.type";
import { addWishlistService, clearWishlistService, getWishlistService, moveWishlistToCartService, removeWishlistService } from "../service/wishlist.service";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

export const addWishlist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

        const data = await addWishlistService(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                WISHLIST_MESSAGE.ADDED,
                data
            )
        );
    }
);

export const getWishlist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const data = await getWishlistService(
            req.user.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                WISHLIST_MESSAGE.FETCHED,
                data
            )
        );
    }
);

export const removeWishlist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await removeWishlistService(
            req.user.id,
            req.params.productId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                WISHLIST_MESSAGE.REMOVED,
            )
        );

    }
);

export const moveWishlistToCart = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cartId = await moveWishlistToCartService(
            req.user.id,
            req.params.productId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                WISHLIST_MESSAGE.MOVED_TO_CART,
                cartId
            )
        );
    }
);

export const clearWishlist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await clearWishlistService(req.user.id);

        return res.status(200).json(
            new ApiResponse(
                200,
                WISHLIST_MESSAGE.CLEARED,
            )
        );
    }
);