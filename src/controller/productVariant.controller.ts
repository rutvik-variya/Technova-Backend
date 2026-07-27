import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PRODUCT_MESSAGE } from "../types/product.types";
import { createVariantService } from "../service/productVariant.service";

export const createVariant = asyncHandler(
    async (req: Request, res: Response) => {
        const variant = await createVariantService(
            req.params.productId as string,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                PRODUCT_MESSAGE.CREATE_VARIANT,
                variant
            )
        );
    }
)