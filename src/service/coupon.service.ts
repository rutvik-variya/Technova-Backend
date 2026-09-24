import { CouponStatus, CouponType } from "@prisma/client";
import prisma from "../lib/prisma";
import { COUPON_MESSAGE, CreateCouponInput } from "../types/coupon.type";
import { ApiError } from "../utils/ApiError";
import { getValidCoupon } from "../utils/coupon/getValidCoupon";
import { calculateDiscount } from "../utils/coupon/calculateDiscount";

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

// apply coupon service

export const applyCouponService = async (
    userId: string,
    code: string
) => {
    const [coupon, cart] = await Promise.all([
        getValidCoupon(code),

        prisma.cart.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
                cartItems: {
                    select: {
                        priceAtAdded: true,
                        quantity: true,
                    },
                },
            },
        }),
    ]);

    if (!cart || cart.cartItems.length === 0) {
        throw new ApiError(
            400,
            COUPON_MESSAGE.CART_EMPTY
        );
    }

    const previousUsage =
        await prisma.couponUsage.findUnique({
            where: {
                couponId_userId: {
                    couponId: coupon.id,
                    userId,
                },
            },
            select: {
                id: true,
            },
        });

    if (previousUsage) {
        throw new ApiError(
            400,
            COUPON_MESSAGE.COUPON_ALREADY_USED
        );
    }

    const subtotal = cart.cartItems.reduce(
        (total, item) => {
            return (
                total +
                Number(item.priceAtAdded) *
                item.quantity
            );
        },
        0
    );

    if (
        coupon.minOrderAmount !== null &&
        subtotal <
        Number(coupon.minOrderAmount)
    ) {
        throw new ApiError(
            400,
            `Minimum order amount is ${coupon.minOrderAmount}`
        );
    }

    const discount = calculateDiscount({
        type: coupon.type,
        value: Number(coupon.value),
        maxOrderAmount:
            coupon.maxOrderAmount !== null
                ? Number(coupon.maxOrderAmount)
                : null,
        subtotal,
    });

    await prisma.cart.update({
        where: {
            id: cart.id,
        },
        data: {
            couponId: coupon.id,
        },
    });

    return {
        coupon: {
            id: coupon.id,
            code: coupon.code,
            type: coupon.type,
        },
        subtotal,
        discount,
        total: subtotal - discount,
    };
};

export const removeCouponService = async (
    userId: string
) => {
    try {
        return await prisma.cart.update({
            where: {
                userId,
            },
            data: {
                couponId: null,
            },
        });
    } catch (error) {
        throw new ApiError(
            404,
            COUPON_MESSAGE.CART_EMPTY
        );
    }
};