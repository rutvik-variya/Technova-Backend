export interface AddToCartDto {
    productId: string,
    variantId: string,
    quantity: number
}
export interface UpdateCartItemDto {
    quantity: number;
}
export interface RemoveCartItemDto {
    itemId: string;
}

export const CART_MESSAGE = {
    ADDED: "Product added to cart successfully.",

    PRODUCT_NOT_FOUND: "Product not found.",
    VARIANT_NOT_FOUND: "Variant not found.",
    OUT_OF_STOCK: "Insufficient stock.",
    FAILED_CREATE_CART: "Failed to create or retrieve cart.",

    CART_ITEM_FETCHED: "Cart items fetched successfully.",
    UPDATED: "Cart updated successfully.",
    CART_NOT_FOUND: "Cart not found.",
    CART_ITEM_NOT_FOUND: "Cart item not found.",
};



