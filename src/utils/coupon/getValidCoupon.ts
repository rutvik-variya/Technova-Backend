import prisma from "../../lib/prisma";
import { COUPON_MESSAGE } from "../../types/coupon.type";
import { ApiError } from "../ApiError";

export const getValidCoupon = async (code: string) => {
    const now = new Date();

    const coupon = await prisma.coupon.findUnique({
        where: {
            code,
        },
        select: {
            id: true,
            code: true,
            type: true,
            value: true,
            minOrderAmount: true,
            maxOrderAmount: true,
            status: true,
            startDate: true,
            endDate: true,
            usageLimit: true,
            usedCount: true,
        },
    });

    if (!coupon) {
        throw new ApiError(
            400,
            COUPON_MESSAGE.INVALID_COUPON
        );
    }

    if (coupon.status !== "ACTIVE") {
        throw new ApiError(
            400,
            COUPON_MESSAGE.NOT_ACTIVE_COUPON
        );
    }

    if (
        now < coupon.startDate ||
        now > coupon.endDate
    ) {
        throw new ApiError(
            400,
            COUPON_MESSAGE.COUPON_EXPIRED
        );
    }

    if (
        coupon.usageLimit !== null &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        throw new ApiError(
            400,
            COUPON_MESSAGE.OUT_OF_LIMIT
        );
    }

    return coupon;
};