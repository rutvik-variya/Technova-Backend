
export interface CheckoutDto {
    addressId: string;
}

export const CHECKOUT_MESSAGE = {
    CART_EMPTY: "Cart is empty",
    ADDRESS_NOT_FOUND: "Address not found",
    ADDRESS_NOT_BELONG_TO_USER: "Address does not belong to user",
    PRODUCT_NOT_FOUND: "Product not found",
    VARIANT_NOT_FOUND: "Product variant not found",
    OUT_OF_STOCK: "Product is out of stock",
    INSUFFICIENT_STOCK: "Product has insufficient stock",
    CHECKOUT_READY: "Checkout calculated successfully",

}