import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.session;

    if (!token) return next(new ApiError(401, "Unauthorized"));

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return next(new ApiError(401, "Session expired"));
    }

    (req as any).user = session.user;
    next();
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!roles.includes(user.role)) {
            return next(new ApiError(403, "Forbidden"));
        }
        next();
    };
};
