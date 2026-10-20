import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { AUTH_MESSAGE } from "../types/auth.types";

interface AdminUsersQuery {
    page: number;
    limit: number;
    search?: string;
    role?: Role;
    sortBy: "createdAt" | "name" | "email";
    sortOrder: "asc" | "desc";
}

export const getAdminUsersService = async ({
    page,
    limit,
    search,
    role,
    sortBy,
    sortOrder,
}: AdminUsersQuery) => {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (role) {
        where.role = role;
    }

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                email: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    const orderBy: Prisma.UserOrderByWithRelationInput = {
        [sortBy]: sortOrder,
    };

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            skip,
            take: limit,

            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,

                _count: {
                    select: {
                        orders: true,
                    },
                },
            },

            orderBy,
        }),

        prisma.user.count({
            where,
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        users: users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            orderCount: user._count.orders,
        })),

        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
        },
    };
};


export const getAdminUserByIdService = async (
    userId: string
) => {
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

            _count: {
                select: {
                    orders: true,
                    reviews: true,
                    addresses: true,
                    couponUsages: true,
                },
            },
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

        statistics: {
            orderCount: user._count.orders,
            reviewCount: user._count.reviews,
            addressCount: user._count.addresses,
            couponUsageCount: user._count.couponUsages,
        },
    };
};



export const updateAdminUserRoleService = async (
    userId: string,
    role: Role,
    requestingAdminId: string
) => {
    if (userId === requestingAdminId) {
        throw new ApiError(400, AUTH_MESSAGE.NOT_CHANGE_OWN_ROLE);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            role: true,
        },
    });

    if (!user) {
        throw new ApiError(404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    if (user.role === "ADMIN" && role === "USER") {
        const adminCount = await prisma.user.count({
            where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
            throw new ApiError(400, AUTH_MESSAGE.NOT_DEMOTE_LAST_ADMIN);
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};