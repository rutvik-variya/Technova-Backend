import { Request, Response } from "express";

import {
    getAdminShippingMethodsService,
    updateAdminShippingMethodService,
} from "../service/adminShipping.service";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ADMIN_DASHBOARD_MESSAGE } from "../types/admindashboard";

export const getAdminShippingMethods =
    asyncHandler(
        async (
            _req: Request,
            res: Response
        ) => {
            const methods =
                await getAdminShippingMethodsService();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    ADMIN_DASHBOARD_MESSAGE.ADMIN_SHIPPING_METHODS_FETCHED,
                    methods
                )
            );
        }
    );

export const updateAdminShippingMethod =
    asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const { method } = req.params;

            const updated =
                await updateAdminShippingMethodService(
                    method as "STANDARD" | "EXPRESS",
                    req.body
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    ADMIN_DASHBOARD_MESSAGE.UPDATE_SHIPPING_METHOD_SUCCESS,
                    updated
                )
            );
        }
    );