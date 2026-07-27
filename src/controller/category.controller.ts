import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
    createCategoryService,
    deleteCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
} from "../service/category.service";
import { CATEGORY_MESSAGE } from "../types/category.types";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await createCategoryService(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, CATEGORY_MESSAGE.CREATED, category));
});

const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await getCategoriesService();
    return res
        .status(200)
        .json(new ApiResponse(200, CATEGORY_MESSAGE.FETCHED, categories));
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category = await getCategoryByIdService(req.params.id as string);
    return res
        .status(200)
        .json(new ApiResponse(200, CATEGORY_MESSAGE.FETCHED_ONE, category));
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await updateCategoryService(
        req.params.id as string,
        req.body,
    );
    return res
        .status(200)
        .json(new ApiResponse(200, CATEGORY_MESSAGE.UPDATED, category));
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await deleteCategoryService(req.params.id as string);
    return res
        .status(200)
        .json(new ApiResponse(200, CATEGORY_MESSAGE.DELETED, null));
});

export {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
