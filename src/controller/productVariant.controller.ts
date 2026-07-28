import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PRODUCT_MESSAGE } from "../types/product.types";
import { createVariantService, deleteVariantService, getProductVariantsService, getVariantByIdService, updateVariantService } from "../service/productVariant.service";

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


export const getProductVariants = asyncHandler(
    async (req: Request, res: Response) => {

        const variants = await getProductVariantsService(req.params.productId as string);

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.FETCH_VARIANTS,
                variants
            )
        );
    }
);


export const getVariantById = asyncHandler(
    async (req: Request, res: Response) => {

        const variant = await getVariantByIdService(
            req.params.variantId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.FETCH_ONE_VARIANT,
                variant
            )
        );
    }
);

export const updateVariant = asyncHandler(
    async (req: Request, res: Response) => {

        const variant = await updateVariantService(
            req.params.variantId as string,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.UPDATE_VARIANT,
                variant
            )
        );
    }
);


export const deleteVariant = asyncHandler(
    async (req: Request, res: Response) => {
        await deleteVariantService(req.params.variantId as string);
        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.DELETE_VARIANT,
                null
            )
        );
    }
);


