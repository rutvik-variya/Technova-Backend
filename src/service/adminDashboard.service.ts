import { OrderStatus, Prisma, ProductStatus } from "@prisma/client";
import prisma from "../lib/prisma";

export const getAdminDashboardService = async () => {
    const [
        totalUsers,
        totalProducts,
        totalOrders,
        revenueResult,

        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        recentOrders,
    ] = await Promise.all([

        // user
        prisma.user.count({
            where: {
                role: "USER",
            },
        }),

        // product
        prisma.product.count({
            where: {
                status: ProductStatus.ACTIVE,
                deletedAt: null,
            },
        }),

        // order
        prisma.order.count(),

        // revenue
        prisma.order.aggregate({
            _sum: {
                grandTotal: true,
            },
            where: {
                status: {
                    notIn: [
                        OrderStatus.CANCELLED,
                        OrderStatus.RETURNED,
                    ],
                },
            },
        }),

        // pending
        prisma.order.count({
            where: {
                status: OrderStatus.PENDING,
            },
        }),

        // confirmed
        prisma.order.count({
            where: {
                status: OrderStatus.CONFIRMED,
            },
        }),

        // processing
        prisma.order.count({
            where: {
                status: OrderStatus.PROCESSING,
            },
        }),

        // shipped
        prisma.order.count({
            where: {
                status: OrderStatus.SHIPPED,
            },
        }),

        // delivered
        prisma.order.count({
            where: {
                status: OrderStatus.DELIVERED,
            },
        }),

        // cancelled
        prisma.order.count({
            where: {
                status: OrderStatus.CANCELLED,
            },
        }),

        // returned
        prisma.order.count({
            where: {
                status: OrderStatus.RETURNED,
            },
        }),


        // recent orders
        prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            select: {
                id: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                paymentMethod: true,
                grandTotal: true,
                createdAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
    ]);

    return {
        summary: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: Number(
                revenueResult._sum.grandTotal ?? 0
            ),
        },

        orders: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
            returned: returnedOrders,
        },

        recentOrders: recentOrders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            grandTotal: Number(order.grandTotal),
            createdAt: order.createdAt,

            customer: order.user,
        })),
    };
};



export const getAdminDashboardSalesService = async (
    period: "7d" | "30d" | "90d" | "1y"
) => {
    const now = new Date();

    const startDate = new Date(now);

    switch (period) {
        case "7d":
            startDate.setDate(startDate.getDate() - 7);
            break;

        case "30d":
            startDate.setDate(startDate.getDate() - 30);
            break;

        case "90d":
            startDate.setDate(startDate.getDate() - 90);
            break;

        case "1y":
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }

    const sales = await prisma.$queryRaw<
        Array<{
            date: Date;
            orders: bigint;
            revenue: Prisma.Decimal;
        }>
    >(Prisma.sql`
        SELECT
            DATE_TRUNC('day', "createdAt") AS date,
            COUNT(*)::bigint AS orders,
            COALESCE(SUM("grandTotal"), 0) AS revenue
        FROM "Order"
        WHERE "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
          AND "status" NOT IN ('CANCELLED', 'RETURNED')
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
    `);

    const data = sales.map((item) => ({
        date: item.date,
        orders: Number(item.orders),
        revenue: Number(item.revenue),
    }));

    const totalOrders = data.reduce(
        (total, item) => total + item.orders,
        0
    );

    const totalRevenue = data.reduce(
        (total, item) => total + item.revenue,
        0
    );

    return {
        period,
        startDate,
        endDate: now,
        totalOrders,
        totalRevenue,
        data,
    };
};