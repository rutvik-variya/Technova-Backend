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


    validateCheckoutCart(cart)

    validateCheckoutItems(cart!.cartItems)

    validateCheckoutStock(cart!.cartItems)

    const totals = calculateCartTotals(
        cart!.cartItems.map(item => ({
            id: item.id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            cartId: item.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtAdded: item.priceAtAdded
        }))
    )

    return checkoutResponse({
        cart,
        address,
        totals
    })
}

