import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
    createProductService,
    deleteProductService,
    getFeaturedProductsService,
    getProductBySlugService,
    getProductSevice,
    getRelatedProductsService,
    updateFeaturedStatusService,
    updateProductService,
} from "../service/product.service";
import { PRODUCT_MESSAGE } from "../types/product.types";

export const createProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await createProductService(req.body);
        return res
            .status(201)
            .json(new ApiResponse(201, PRODUCT_MESSAGE.CREATED, product));
    },
);

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await getProductSevice(req.query);
    return res
        .status(200)
        .json(new ApiResponse(200, PRODUCT_MESSAGE.FETCHED, products));
});

export const getProductBySlug = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await getProductBySlugService(req.params.slug as string);
        return res
            .status(200)
            .json(new ApiResponse(200, PRODUCT_MESSAGE.FETCHED_ONE, product));
    },
);

export const updateProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await updateProductService(
            req.params.id as string,
            req.body,
        );
        return res
            .status(200)
            .json(new ApiResponse(200, PRODUCT_MESSAGE.UPDATED, product));
    },
);

export const deleteProduct = asyncHandler(
    async (req: Request, res: Response) => {
        await deleteProductService(req.params.id as string);
        return res
            .status(200)
            .json(new ApiResponse(200, PRODUCT_MESSAGE.DELETED, null));
    },
);


export const getFeaturedProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const products = await getFeaturedProductsService();
        return res
            .status(200)
            .json(new ApiResponse(200, PRODUCT_MESSAGE.FEATURED_PRODUCT_FETCHED, products))
    }
)

export const updateFeaturedStatus = asyncHandler(
    async (req: Request, res: Response) => {

        const product = await updateFeaturedStatusService(
            req.params.id as string,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.FEATURED_UPDATED,
                product
            )
        );
    }
);



export const getRelatedProducts = asyncHandler(
    async (req: Request, res: Response) => {

        const products =
            await getRelatedProductsService(
                req.params.slug as string
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.RELATED_PRODUCTS_FETCHED,
                products
            )
        );
    }
);
