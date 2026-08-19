import { CouponStatus, CouponType } from "@prisma/client";

export interface CreateCouponInput {
    code: string;
    description?: string;
    type: CouponType
    value: number;
    minOrderAmount: number;
    maxOrderAmount: number;
    usageLimit?: number;
    startDate: Date;
    endDate: Date;
    status: CouponStatus;
}


export const COUPON_MESSAGE = {
    COUPON_ALREADY_EXIST: "Coupon code already exists",
    EXCEED_PERCENTAGE: "Percentage discount cannot exceed 100%",
    CREATE_COUPON: "Coupon created successfully",
    COUPON_NOT_FOUND: "Coupon not found",
    COUPON_CODE_ALREADY_EXIST: "Coupon code already exists",
    UPDATE_COUPON: "Coupon updated successfully",
    DELETE_COUPON: "Coupon deactivated successfully",
    APPLY_COUPON: "Coupon applied successfully",
    REMOVE_COUPON: "Coupon removed successfully",
    NO_CHANGES_DETECT: "No changes detected. Please update at least one field.",
    INVALID_COUPON: "Invalid or expired coupon",
    OUT_OF_LIMIT: "Coupon usage limit reached",
    CART_EMPTY: "Cart is empty",

    // validate
    NOT_ACTIVE_COUPON: "Coupon is no longer active",
    COUPON_EXPIRED: "Coupon has expired",
    COUPON_LIMIT_REACHED: "Coupon usage limit reached",
    COUPON_ALREADY_USED: "You have already used this coupon",
}