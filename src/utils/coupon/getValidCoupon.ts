import prisma from "../../lib/prisma";
import { COUPON_MESSAGE } from "../../types/coupon.type";
import { ApiError } from "../ApiError";

export const getValidCoupon = async (
    code: string
) => {
    const now = new Date();
    const coupon = await prisma.coupon.findFirst({
        where: {
            code,
            status: "ACTIVE",
            startDate: {
                lte: now
            },
            endDate: {
                gte: now
            },
            OR: [
                {
                    usageLimit: null
                },
                {
                    usageLimit: {
                        gt: 0
                    }
                }
            ]
        }
    });

    if (!coupon) {
        throw new ApiError(400, COUPON_MESSAGE.INVALID_COUPON);
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(400, COUPON_MESSAGE.OUT_OF_LIMIT);
    }

    return coupon;
};