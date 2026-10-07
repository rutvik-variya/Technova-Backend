import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ADMIN_DASHBOARD_MESSAGE } from "../types/admindashboard";
import { getAdminDashboardSalesService, getAdminDashboardService } from "../service/adminDashboard.service";


export const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboardData = await getAdminDashboardService();
    return res
        .status(200)
        .json(new ApiResponse(200, ADMIN_DASHBOARD_MESSAGE.FETCHED, dashboardData));
});


export const getAdminDashboardSales = asyncHandler(
    async (req: Request, res: Response) => {
        const period = req.query.period as
            | "7d"
            | "30d"
            | "90d"
            | "1y";

        const sales = await getAdminDashboardSalesService(period);

        return res.status(200).json(
            new ApiResponse(
                200,
                ADMIN_DASHBOARD_MESSAGE.SALES_SUMMARY_FETCHED,
                sales
            )
        );
    }
);