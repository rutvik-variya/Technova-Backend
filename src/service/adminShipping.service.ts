import { Prisma, ShippingMethod } from "@prisma/client";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const getAdminShippingMethodsService =
    async () => {
        const methods =
            await prisma.shippingMethodConfig.findMany({
                orderBy: {
                    method: "asc",
                },

                select: {
                    id: true,
                    method: true,
                    name: true,
                    baseCharge: true,
                    freeShippingAbove: true,
                    estimatedDays: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

        return methods.map(
            (method: (typeof methods)[number]) => ({
                ...method,
                baseCharge: Number(method.baseCharge),
                freeShippingAbove: Number(
                    method.freeShippingAbove
                ),
            })
        );
    };


export const updateAdminShippingMethodService =
    async (
        method: ShippingMethod,
        data: {
            name?: string;
            baseCharge?: number;
            freeShippingAbove?: number;
            estimatedDays?: number;
            isActive?: boolean;
        }
    ) => {
        const existing =
            await prisma.shippingMethodConfig.findUnique({
                where: {
                    method,
                },
            });

        if (!existing) {
            throw new ApiError(
                404,
                "Shipping method not found"
            );
        }

        const updated =
            await prisma.shippingMethodConfig.update({
                where: {
                    method,
                },

                data: {
                    ...(data.name !== undefined && {
                        name: data.name,
                    }),

                    ...(data.baseCharge !== undefined && {
                        baseCharge:
                            new Prisma.Decimal(
                                data.baseCharge
                            ),
                    }),

                    ...(data.freeShippingAbove !==
                        undefined && {
                        freeShippingAbove:
                            new Prisma.Decimal(
                                data.freeShippingAbove
                            ),
                    }),

                    ...(data.estimatedDays !== undefined && {
                        estimatedDays:
                            data.estimatedDays,
                    }),

                    ...(data.isActive !== undefined && {
                        isActive: data.isActive,
                    }),
                },

                select: {
                    id: true,
                    method: true,
                    name: true,
                    baseCharge: true,
                    freeShippingAbove: true,
                    estimatedDays: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

        return {
            ...updated,
            baseCharge: Number(updated.baseCharge),
            freeShippingAbove: Number(
                updated.freeShippingAbove
            ),
        };
    };