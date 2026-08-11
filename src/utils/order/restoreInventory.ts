import { Prisma } from "@prisma/client";


export const restoreInventory = async (
    tx: Prisma.TransactionClient,
    items: {
        variantId: string | null;
        quantity: number;
    }[]
) => {
    for (const item of items) {
        if (!item.variantId) {
            continue;
        }
        await tx.productVariant.update({
            where: {
                id: item.variantId,
            },

            data: {
                stock: {
                    increment: item.quantity,
                },
            },
        });
    }
}