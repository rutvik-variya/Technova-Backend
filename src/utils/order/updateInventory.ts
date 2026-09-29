
import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

type InventoryItem = {
    variantId: string | null;
    quantity: number;
    product: {
        name: string;
    };
};

export const updateInventory = async (
    tx: Prisma.TransactionClient,
    items: InventoryItem[]
) => {
    if (items.length === 0) return;

    // Ensure each cart item has a valid variant ID.
    for (const item of items) {
        if (!item.variantId) {
            throw new ApiError(
                400,
                ORDER_MESSAGE.PRODUCT_UNAVAILABLE
            );
        }
    }

    // Build parameterized SQL VALUES rows.
    const values = items.map((item) =>
        Prisma.sql`(
            ${item.variantId}::text,
            ${item.quantity}::int
        )`
    );

    // Deduct stock for all variants in a single query.
    const updatedCount = await tx.$executeRaw(
        Prisma.sql`
            UPDATE "ProductVariant" AS pv
            SET
                "stock" = pv."stock" - v."quantity",
                "updatedAt" = NOW()
            FROM (
                VALUES ${Prisma.join(values)}
            ) AS v("variantId", "quantity")
            WHERE
                pv."id" = v."variantId"
                AND pv."stock" >= v."quantity"
        `
    );

    // If any item could not be updated, roll back the transaction.
    if (updatedCount !== items.length) {
        throw new ApiError(
            409,
            ORDER_MESSAGE.INSUFFICIENT_STOCK
        );
    }
};