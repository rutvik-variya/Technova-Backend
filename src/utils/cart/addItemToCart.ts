import { Prisma } from "@prisma/client";
import { AddToCartDto, CART_MESSAGE } from "../../types/cart.types";
import { getOrCreateCart } from "./getOrCreateCart";
import { validateProduct } from "./validateProduct";
import { validateStock } from "./validateStock";
import { updateCartTotals } from "./updateCartTotals";
import { ApiError } from "../ApiError";

export const addItemToCart = async (
    tx: Prisma.TransactionClient,
    userId: string,
    payload: AddToCartDto
) => {
    const {
        productId,
        variantId,
        quantity,
    } = payload;

    // 1. Get or create cart inside transaction
    const cart = await getOrCreateCart(tx, userId);

    if (!cart) {
        throw new ApiError(
            500,
            CART_MESSAGE.FAILED_CREATE_CART
        );
    }

    // 2. Validate product + variant
    const { variant } = await validateProduct(
        tx,
        productId,
        variantId
    );

    // 3. Find existing cart item
    const existingItem = await tx.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
            variantId: variantId ?? null,
        },
        select: {
            id: true,
            quantity: true,
        },
    });

    const finalQuantity =
        (existingItem?.quantity ?? 0) + quantity;

    // 4. Validate stock
    validateStock(
        variant.stock,
        finalQuantity
    );

    // 5. Create / update item
    if (existingItem) {
        await tx.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: finalQuantity,
            },
        });
    } else {
        await tx.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                variantId,
                quantity,
                priceAtAdded: variant.price,
            },
        });
    }

    // 6. Update cart totals
    await updateCartTotals(
        tx,
        cart.id
    );

    return {
        cartId: cart.id,
    };
};