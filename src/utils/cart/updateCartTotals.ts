import { Prisma } from "@prisma/client";

import { calculateCartTotals } from "./calculateCartTotals";

export const updateCartTotals = async (
    tx: Prisma.TransactionClient,
    cartId: string
) => {
    const items = await tx.cartItem.findMany({
        where: {
            cartId
        }
    })

    const totals = calculateCartTotals(items);

    await tx.cart.update({
        where: {
            id: cartId
        },
        data: totals
    })
    return totals;

}
