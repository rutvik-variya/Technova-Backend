import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { SHIPPING_MESSAGE } from "../types/shipping.types";
import { getShippingMethodsService } from "../service/shipping.service";


type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};


export const getShippingMethods = asyncHandler(
    async (req: Request, res: Response) => {
        const subtotal = Number(req.query.subtotal);

        if (Number.isNaN(subtotal) || subtotal < 0) {
            throw new ApiError(400, SHIPPING_MESSAGE.INVALID_SUBTOTAL)
        }
        const result = await getShippingMethodsService(subtotal);

        return res.status(200).json(
            new ApiResponse(
                200,
                SHIPPING_MESSAGE.FETCH_SHIPPING,
                result
            )
        );
    }
);

