import { ProductStatus } from "@prisma/client";
export interface createProductDto {
    name: string;
    description: string;
    shortDescription?: string;
    brand: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    categoryId: string;
}

export interface updateProductDto extends Partial<createProductDto> { }

export interface createVariantDto {
    sku: string,
    ram: string,
    storage: string,
    color: string,
    price: number,
    comparePrice: number,
    stock: number
    isActive: boolean,
    productId: string
}


export const PRODUCT_MESSAGE = {
    CREATED: "Product created successfully",
    ALREADY_EXISTS: "Product already exists",
    CATEGORY_NOT_FOUND: "Category not found",
    NOT_FOUND: "Product not found",
    FETCHED: "Products fetched successfully",
    FETCHED_ONE: "Product fetched successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",

    UPLOAD_PRODUCT_IMAGE: "Product images uploaded successfully",
    FETCH_PRODUCT_IMAGE: "Product fetch succesfullly",
    IMAGE_NOT_FOUND: "Image not found",
    PRIMARY_IMAGE_UPDATE: "Primary image updated successfully",
    PRODUCT_IMAGE_DELETE: "Product image deleted successfully",

    CREATE_VARIANT: "Product variant created successfully",
    SKU_EXISTS: "SKU already exists"
}