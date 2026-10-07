import { Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

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