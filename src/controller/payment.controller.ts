import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { createPaymentService, verifyPaymentService } from "../service/payment.service";
import { PAYMENT_MESSAGE } from "../types/payment.types";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};


export const createPayment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const result = await createPaymentService(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                PAYMENT_MESSAGE.PAYMENT_CREATED,
                result
            )
        );
    }
);

export const verifyPayment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user.id;
        const paymentId = Array.isArray(req.params.paymentId)
            ? req.params.paymentId[0]
            : req.params.paymentId;

        const result = await verifyPaymentService(
            userId,
            paymentId,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                PAYMENT_MESSAGE.PAYMENT_SUCCESS,
                result
            )
        );
    }
);


