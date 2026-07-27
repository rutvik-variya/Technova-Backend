import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { deleteProductImageService, getProductImagesService, setPrimaryProductImageService, uploadProductImagesService } from "../service/productImage.service";
import { PRODUCT_MESSAGE } from "../types/product.types";

export const uploadProductImages = asyncHandler(
    async (req: Request, res: Response) => {
        const images = await uploadProductImagesService(
            req.params.id as string,
            req.files as Express.Multer.File[],
        );
        return res
            .status(201)
            .json(new ApiResponse(201, PRODUCT_MESSAGE.UPLOAD_PRODUCT_IMAGE, images));
    },
);


export const getProductImage = asyncHandler(
    async (req: Request, res: Response) => {
        const productImages = await getProductImagesService(req.params.id as string)
        return res
            .status(200)
            .json(new ApiResponse(200, PRODUCT_MESSAGE.FETCH_PRODUCT_IMAGE, productImages));
    }
)


export const setPrimaryProductImage = asyncHandler(
    async (req: Request, res: Response) => {
        const image = await setPrimaryProductImageService(req.params.imageId as string);

        return res.status(200).json(
            new ApiResponse(200, PRODUCT_MESSAGE.PRIMARY_IMAGE_UPDATE, image)
        );
    }
);

export const deleteProductImage = asyncHandler(
    async (req: Request, res: Response) => {

        await deleteProductImageService(req.params.imageId as string);

        return res.status(200).json(new ApiResponse(200, PRODUCT_MESSAGE.PRODUCT_IMAGE_DELETE, null)
        );
    }
);