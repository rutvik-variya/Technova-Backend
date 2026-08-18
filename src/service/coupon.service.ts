import { CouponStatus, CouponType } from "@prisma/client";
import prisma from "../lib/prisma";
import { COUPON_MESSAGE, CreateCouponInput } from "../types/coupon.type";
import { ApiError } from "../utils/ApiError";

export const createCouponService = async (
    data: CreateCouponInput
) => {
    const existingCoupon = await prisma.coupon.findUnique({
        where: {
            code: data.code
        }
    });

    if (existingCoupon) {
        throw new ApiError(409, COUPON_MESSAGE.COUPON_ALREADY_EXIST);
    }

    if (data.type === CouponType.PERCENTAGE && data.value > 100) {
        throw new ApiError(400, COUPON_MESSAGE.EXCEED_PERCENTAGE);
    }

    return prisma.coupon.create({
        data: {
            code: data.code,
            description: data.description,
            type: data.type,
            value: data.value,
            minOrderAmount: data.minOrderAmount,
            maxOrderAmount: data.maxOrderAmount,
            usageLimit: data.usageLimit ?? null,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status ?? CouponStatus.ACTIVE,
        }
    });
}


export const updateCouponService = async (
    couponId: string,
    data: Partial<CreateCouponInput>
) => {
    const coupon = await prisma.coupon.findUnique({
        where: {
            id: couponId
        }
    });

    if (!coupon) {
        throw new ApiError(404, COUPON_MESSAGE.COUPON_NOT_FOUND);
    }

    if (data.code) {
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                code: data.code
            }
        });

        if (existingCoupon) {
            throw new ApiError(409, COUPON_MESSAGE.COUPON_CODE_ALREADY_EXIST);
        }
    }

    const hasChanges = Object.entries(data).some(
        ([key, value]) => {
            return value !== coupon[key as keyof typeof coupon];
        }
    );

    if (!hasChanges) {
        throw new ApiError(400, COUPON_MESSAGE.NO_CHANGES_DETECT);
    }

    return prisma.coupon.update({
        where: {
            id: couponId
        },
        data
    });
};


export const deleteCouponService = async (
    couponId: string
) => {
    const coupon = await prisma.coupon.findUnique({
        where: {
            id: couponId
        }
    });

    if (!coupon) {
        throw new ApiError(404, COUPON_MESSAGE.COUPON_NOT_FOUND);
    }

    return prisma.coupon.update({
        where: {
            id: couponId
        },
        data: {
            status: "INACTIVE"
        }
    });
};


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