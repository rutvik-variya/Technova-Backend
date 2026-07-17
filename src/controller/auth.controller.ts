import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { AuthService } from "../service/auth.service";

const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(
        req.body.name,
        req.body.email,
        req.body.password
    )

    res.status(201).json(new ApiResponse(201, "User registered", user))
})


const login = asyncHandler(async (req: Request, res: Response) => {
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

const logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.session;

    if (token) {
        await AuthService.logout(token);
    }

    res.clearCookie("session");

    res.json(new ApiResponse(200, "Logout successful"));
});

export { register, login, logout }