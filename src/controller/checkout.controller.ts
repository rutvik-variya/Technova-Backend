import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { CHECKOUT_MESSAGE } from "../types/checkout.types";
import { getCheckoutService } from "../service/checkout.service";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};
export const getCheckout = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user.id;
        const result = await getCheckoutService(
            userId,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                CHECKOUT_MESSAGE.CHECKOUT_READY,
                result
            )
        );
    }
);