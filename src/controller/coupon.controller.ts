import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { createCouponService, deleteCouponService, updateCouponService } from "../service/coupon.service";
import { COUPON_MESSAGE } from "../types/coupon.type";

export const createCoupon = asyncHandler(
    async (req: Request, res: Response) => {
        const data = req.body;
        const coupon = await createCouponService(data);

        return res.status(201).json(
            new ApiResponse(
                201,
                COUPON_MESSAGE.CREATE_COUPON,
                coupon
            )
        );
    }
);

export const updateCoupon = asyncHandler(
    async (req: Request, res: Response) => {
        const data = req.body;
        const coupon = await updateCouponService(
            req.params.id as string,
            data
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.UPDATE_COUPON,
                coupon
            )
        );
    }
);

export const deleteCoupon = asyncHandler(
    async (req: Request, res: Response) => {
        await deleteCouponService(req.params.id as string);

        return res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.DELETE_COUPON
            )
        );
    }
);