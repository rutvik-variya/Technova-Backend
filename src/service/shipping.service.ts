import prisma from "../lib/prisma";
import { SHIPPING_MESSAGE } from "../types/shipping.types";
import { ApiError } from "../utils/ApiError";
import { calculateShippingCharge } from "../utils/shipping/shipping.helper";

export const getShippingMethodsService =
    async (subtotal: number) => {
        if (subtotal < 0) {
            throw new ApiError(400, SHIPPING_MESSAGE.INVALID_SUBTOTAL)
        }

        const methods = await prisma.shippingMethodConfig.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                method: true,
                name: true,
                baseCharge: true,
                freeShippingAbove: true,
                estimatedDays: true
            },
            orderBy: {
                baseCharge: "asc"
            }
        })

        return methods.map((method) => {
            const shipping = calculateShippingCharge({
                shippingMethod: {
                    method: method.method,
                    baseCharge: Number(method.baseCharge),
                    freeShippingAbove: Number(method.freeShippingAbove),
                    estimatedDays: Number(method.estimatedDays),
                },
                subtotal
            })

            return {
                id: method.id,
                method: method.method,
                name: method.name,
                charge: shipping.charge,
                estimatedDays: shipping.estimatedDays,
            }
        })
    }