import { ApiError } from "../utils/ApiError";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ChangePasswordDto } from "../validators/auth.validator";
import { AUTH_MESSAGE } from "../types/auth.types";

export class AuthService {
    // register
    static async register(name: string, email: string, password: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })
    }

    // login
    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new ApiError(401, "Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");
        const sessionToken = crypto.randomBytes(32).toString("hex")

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.session.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expiresAt
            }
        })

        return {
            sessionToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    static async logout(token: string) {
        await prisma.session.deleteMany({ where: { token } });
    }

    static async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },

            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    }
}

export const changePasswordService = async (
    userId: string,
    payload: ChangePasswordDto
) => {
    const {
        currentPassword,
        newPassword,
    } = payload;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            password: true,
        },
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            AUTH_MESSAGE.CURRENT_PASSWORD_INVALID
        );
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    return null;
};