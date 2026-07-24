import { ProductStatus } from "@prisma/client";
export interface createProdutDto {
    name: string;
    description: string;
    shortDescription?: string;
    brand: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    categoryId: string;
}

export interface updateProductDto extends Partial<createProdutDto> { }


export const PRODUCT_MESSAGE = {
    CREATED: "Product created successfully",
    ALREADY_EXISTS: "Product already exists",
    CATEGORY_NOT_FOUND: "Category not found",
    NOT_FOUND: "Product not found",
    FETCHED: "Products fetched successfully",
    FETCHED_ONE: "Product fetched successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",
}