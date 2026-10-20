import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService, changePasswordService } from "../service/auth.service";
import { AUTH_MESSAGE } from "../types/auth.types";
import { updateAdminUserRoleService } from "../service/adminUser.service";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(
        req.body.name,
        req.body.email,
        req.body.password
    )

    res.status(201).json(new ApiResponse(201, "User registered", user))
})


export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(
        req.body.email,
        req.body.password
    )

    res.cookie("session", result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    })

    res.json(new ApiResponse(200, "Login Successful", result.user))
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.session;
    if (token) {
        await AuthService.logout(token);
    }

    res.clearCookie("session");
    res.json(new ApiResponse(200, "Logout successful"));
});


export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await AuthService.getCurrentUser(req.user.id);
    res.json(new ApiResponse(200, "Fetch current user", user));
});


export const changePassword = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await changePasswordService(
            req.user.id,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESS,
                null
            )
        );
    }
);


export const updateAdminUserRole = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const rawUserId = req.params.userId;

        const userId = Array.isArray(rawUserId)
            ? rawUserId[0]
            : rawUserId;

        const { role } = req.body;

        const user = await updateAdminUserRoleService(
            userId,
            role,
            req.user.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                AUTH_MESSAGE.USER_ROLE_UPDATED,
                user
            )
        );
    }
);
