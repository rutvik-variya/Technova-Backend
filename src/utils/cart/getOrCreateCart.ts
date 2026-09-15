import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export const getOrCreateCart = async (
    db: typeof prisma | Prisma.TransactionClient,
    userId: string
) => {
    return db.cart.upsert({
        where: {
            userId,
        },
        update: {},
        create: {
            userId,
        },
        select: {
            id: true,
        },
    });
};