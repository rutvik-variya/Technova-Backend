import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { COUPON_MESSAGE } from "../../types/coupon.type";

export const validateCouponForOrder = async (
    tx: Prisma.TransactionClient,
    couponId: string,
    userId: string,
    subtotal: number
) => {
    const coupon = await tx.coupon.findUnique({
        where: {
            id: couponId,
        },
    });

    if (!coupon) {
        throw new ApiError(400, COUPON_MESSAGE.COUPON_NOT_FOUND);
    }

    const now = new Date();

    if (coupon.status !== "ACTIVE") {
        throw new ApiError(400, COUPON_MESSAGE.NOT_ACTIVE_COUPON);
    }

    if (now < coupon.startDate || now > coupon.endDate) {
        throw new ApiError(400, COUPON_MESSAGE.COUPON_EXPIRED);
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(400, COUPON_MESSAGE.COUPON_LIMIT_REACHED);
    }

    if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
        throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount}`);
    }

    const previousUsage =
        await tx.couponUsage.findUnique({
            where: {
                couponId_userId: {
                    couponId,
                    userId,
                },
            },
        });

    if (previousUsage) {
        throw new ApiError(400, COUPON_MESSAGE.COUPON_ALREADY_USED);
    }
    return coupon;
};

export const consumeCouponForOrder = async (
    tx: Prisma.TransactionClient,
    couponId: string,
    userId: string,
    orderId: string,
    usageLimit: number | null
) => {
    const result =
        await tx.coupon.updateMany({
            where: {
                id: couponId,
                status: "ACTIVE",

                ...(usageLimit !== null
                    ? {
                        usedCount: {
                            lt: usageLimit,
                        },
                    }
                    : {}),
            },

            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });

    if (result.count !== 1) {
        throw new ApiError(400, COUPON_MESSAGE.COUPON_LIMIT_REACHED);
    }

    await tx.couponUsage.create({
        data: {
            couponId,
            userId,
            orderId,
        },
    });
};