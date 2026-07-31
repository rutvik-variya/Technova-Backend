export interface AddToCartDto {
    productId: string,
    variantId: string,
    quantity: number
}

export const CART_MESSAGE = {
    ADDED: "Product added to cart successfully.",
    UPDATED: "Cart updated successfully.",
    PRODUCT_NOT_FOUND: "Product not found.",
    VARIANT_NOT_FOUND: "Variant not found.",
    OUT_OF_STOCK: "Insufficient stock.",
};



