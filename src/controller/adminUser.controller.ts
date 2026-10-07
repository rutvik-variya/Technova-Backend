import { Request, Response } from "express";

import {
    getAdminUsersService,
    getAdminUserByIdService,
} from "../service/adminUser.service";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ADMIN_DASHBOARD_MESSAGE } from "../types/admindashboard";


export const getAdminUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            page = "1",
            limit = "10",
            search,
            role,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const result = await getAdminUsersService({
            page: pageNumber,
            limit: limitNumber,
            search: typeof search === "string" ? search : undefined,
            role:
                role === "USER" || role === "ADMIN"
                    ? role
                    : undefined,
            sortBy:
                sortBy === "name" ||
                    sortBy === "email" ||
                    sortBy === "createdAt"
                    ? sortBy
                    : "createdAt",
            sortOrder:
                sortOrder === "asc" || sortOrder === "desc"
                    ? sortOrder
                    : "desc",
        });

        return res.status(200).json(
            new ApiResponse(    
                200,
                ADMIN_DASHBOARD_MESSAGE.ADMIN_USERS_FETCHED,
                result
            )
        );
    }
);

export const getAdminUserById = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.params.userId);

        const user = await getAdminUserByIdService(userId);

        return res.status(200).json(
            new ApiResponse(
                200,
                ADMIN_DASHBOARD_MESSAGE.ADMIN_USER_FETCHED,
                user
            )
        );
    }
);
