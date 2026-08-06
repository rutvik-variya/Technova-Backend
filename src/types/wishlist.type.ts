export interface AddWishlistDto {
    productId: string;
}


export const WISHLIST_MESSAGE = {
    ADDED: "Product added to wishlist successfully.",
    FETCHED: "Wishlist fetched successfully.",
    REMOVED: "Product removed from wishlist.",
    CLEARED: "Wishlist cleared successfully.",
    PRODUCT_NOT_FOUND: "Product not found.",
    ALREADY_EXISTS: "Product already exists in wishlist.",
    ITEM_NOT_FOUND: "Wishlist item not found.",
    MOVED_TO_CART: "Wishlist item moved to cart successfully."
};
