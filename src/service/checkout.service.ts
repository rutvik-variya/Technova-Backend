import prisma from "../lib/prisma";
import { CheckoutDto } from "../types/checkout.types";
import { calculateCartTotals } from "../utils/cart/calculateCartTotals";
import { checkoutResponse } from "../utils/checkout/checkoutResponse";
import { getCheckoutCart } from "../utils/checkout/getCheckoutCart";
import { validateCheckoutAddress } from "../utils/checkout/validateCheckoutAddress";
import { validateCheckoutCart } from "../utils/checkout/validateCheckoutCart";
import { validateCheckoutItems } from "../utils/checkout/validateCheckoutItems";
import { validateCheckoutStock } from "../utils/checkout/validateCheckoutStock";

export const getCheckoutService = async (
    userId: string,
    payload: CheckoutDto
) => {
    const [cart, address] = await Promise.all([
        getCheckoutCart(
            prisma,
            userId
        ),

        validateCheckoutAddress(
            prisma,
            userId,
            payload.addressId
        ),
    ]);

    if (!cart) {
        throw new Error("Cart not found");
    }

    validateCheckoutCart(cart);

    validateCheckoutItems(cart.cartItems);

    validateCheckoutStock(cart.cartItems);

    const totals = calculateCartTotals(
        cart.cartItems
    );

    return checkoutResponse({
        cart,
        address,
        totals,
    });
};