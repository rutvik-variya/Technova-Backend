import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PRODUCT_MESSAGE } from "../types/product.types";
import { adjustInventoryService, getInventoryService, getLowStockProductsService, getOutOfStockProductsService, updateInventoryService } from "../service/productInventory.service";


export const getInventory = asyncHandler(
    async (req: Request, res: Response) => {
        const inventory = await getInventoryService(req.params.variantId as string);

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.FETCH_INVENTORY,
                inventory
            )
        );
    }
);

export const updateInventory = asyncHandler(
    async (req: Request, res: Response) => {
        const inventory = await updateInventoryService(req.params.variantId as string, req.body);

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.UPDATE_INVENTORY,
                inventory
            )
        );
    }
);


export const adjustInventory = asyncHandler(
    async (req: Request, res: Response) => {
        const inventory = await adjustInventoryService(
            req.params.variantId as string,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.ADJUST_INVENTORY,
                inventory
            )
        );
    }
);

export const getLowStockProducts = asyncHandler(
    async (_req: Request, res: Response) => {

        const products = await getLowStockProductsService();

        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.LOW_STOCK_PRODUCT_FETCH,
                products
            )
        );
    }
);


export const getOutOfStockProducts = asyncHandler(
    async (_req: Request, res: Response) => {
        const products = await getOutOfStockProductsService();
        return res.status(200).json(
            new ApiResponse(
                200,
                PRODUCT_MESSAGE.OUT_OF_STOCK,
                products
            )
        );
    }
);