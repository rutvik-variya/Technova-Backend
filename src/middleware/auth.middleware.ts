import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { SESSION_DURATION } from "../constants/session";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.session;

    if (!token) return next(new ApiError(401, "Unauthorized"));

    const session = await prisma.session.findFirst({
        where: {
            token,
            expiresAt: {
                gt: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    if (!session) {
        return next(new ApiError(401, "Session expired or invalid"));
    }

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {
                id: session?.id
            }
        })
        return next(new ApiError(401, "Session expired or invalid"));
    }

    await prisma.session.update({
        where: {
            id: session.id,
        },
        data: {
            expiresAt: new Date(Date.now() + SESSION_DURATION),
        },
    });

    res.cookie("session", session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + SESSION_DURATION),
    });

    (req as any).user = session.user;
    next();
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!roles.includes(user.role)) {
            throw new ApiError(403, "Forbidden");
        }

        next();
    };
};
