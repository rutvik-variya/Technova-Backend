import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { CART_MESSAGE } from "../types/cart.types";
import { addtocartService, getUserCartService, updateCartItemService, removeCartItemService, clearCartService } from "../service/cart.service";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

export const addToCart = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cartItem = await addtocartService(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                CART_MESSAGE.ADDED,
                cartItem
            )
        );
    }
);


export const getUserCart = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cartItem = await getUserCartService(
            req.user.id
        )

        return res.status(200).json(
            new ApiResponse(
                200,
                CART_MESSAGE.CART_ITEM_FETCHED,
                cartItem
            )
        );
    }
);

export const updateCartItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cart = await updateCartItemService(
            req.user.id,
            req.params.itemId as string,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                CART_MESSAGE.UPDATED,
                cart
            )
        );
    });


// cart.controller.ts

export const removeCartItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cart = await removeCartItemService(
            req.user.id,
            req.params.itemId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Item removed from cart successfully.",
                cart
            )
        );
    }
);

export const clearCart = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
                const cart = await clearCartService(
                        req.user.id
                );

                return res.status(200).json(
                        new ApiResponse(
                                200,
                                "Cart cleared successfully.",
                                cart
                        )
                );
        }
);

