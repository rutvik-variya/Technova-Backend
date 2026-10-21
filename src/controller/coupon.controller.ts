import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { applyCouponService, createCouponService, deleteCouponService, getAdminCouponByIdService, getAdminCouponsService, removeCouponService, updateCouponService } from "../service/coupon.service";
import { COUPON_MESSAGE } from "../types/coupon.type";


type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

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

export const getAdminCoupons = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await getAdminCouponsService(req.query);

        res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.FETCH_ALL_COUPON,
                result
            )
        );
    }
);

export const getAdminCouponById = asyncHandler(
    async (req: Request, res: Response) => {
        const { couponId } = req.params;

        const coupon = await getAdminCouponByIdService(couponId as string);

        res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.FETCH_COUPON,
                coupon
            )
        );
    }
);


export const applyCoupon = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { code } = req.body

        const result = await applyCouponService(
            req.user.id,
            code
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.APPLY_COUPON,
                result
            )
        );
    }
);


export const removeCoupon = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const result = await removeCouponService(
            req.user.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                COUPON_MESSAGE.REMOVE_COUPON,
                result
            )
        );
    }
);