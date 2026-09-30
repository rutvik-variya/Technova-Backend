import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { getOrderForPayment } from "../utils/payment/getOrderForPayment";
import { CreatePaymentDto, PAYMENT_MESSAGE, VerifyPaymentDto } from "../types/payment.types";
import { createPaymentRecord } from "../utils/payment/createPaymentRecord";
import { paymentResponse } from "../utils/payment/paymentResponse";
import { paymentGateway } from "../utils/payment/paymentGateway";
import { updatePaymentStatus } from "../utils/payment/updatePaymentStatus";
import { env } from "../config/env";

export const createPaymentService = async (
    userId: string,
    payload: CreatePaymentDto
) => {
    const order = await getOrderForPayment(
        prisma,
        userId,
        payload.orderId
    )

    if (!order) {
        throw new ApiError(404, PAYMENT_MESSAGE.ORDER_NOT_FOUND);
    }

    if (order.payment) {
        throw new ApiError(409, PAYMENT_MESSAGE.PAYMENT_ALREADY_EXISTS)
    }

    if (order.status === "CANCELLED") {
        throw new ApiError(400, PAYMENT_MESSAGE.CANCEL_ORDER);
    }

    const payment = await prisma.$transaction(async (tx) => {
        const createdPayment = await createPaymentRecord(
            tx,
            {
                orderId: order.id,
                amount: order.grandTotal,
                method: payload.paymentMethod
            }
        )

        await tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentStatus: "PENDING",
            },
        });
        return createdPayment;
    })

    return paymentResponse(payment)
}

export const createOnlinePaymentService = async (
    userId: string,
    orderId: string
) => {
    const order = await getOrderForPayment(prisma, userId, orderId);

    // validate order
    if (!order) {
        throw new ApiError(404, PAYMENT_MESSAGE.ORDER_NOT_FOUND);
    }

    if (order.status === "CANCELLED") {
        throw new ApiError(
            400,
            PAYMENT_MESSAGE.CANCEL_ORDER
        );
    }

    const existingPayment = await prisma.payment.findUnique({
        where: {
            orderId: order.id,
        },
    });

    if (existingPayment) {
        throw new ApiError(409, PAYMENT_MESSAGE.PAYMENT_ALREADY_EXISTS)
    }

    const gatewayPayment =
        await paymentGateway.createPaymentOrder(
            Number(order.grandTotal),
            order.id
        );

    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            amount: order.grandTotal,
            method: "ONLINE",
            status: "PROCESSING",
            gatewayOrderId: gatewayPayment.gatewayOrderId,
        },
    });

    return {
        paymentId: payment.id,
        orderId: order.id,
        gatewayOrderId: payment.gatewayOrderId,
        amount: Number(order.grandTotal),
        currency: "INR",
        keyId: env.RAZORPAY_KEY_ID,
    };
};



export const verifyPaymentService = async (
    userId: string,
    paymentId: string,
    gatewayData: VerifyPaymentDto
) => {
    const payment = await prisma.payment.findFirst({
        where: {
            id: paymentId,
            order: {
                userId,
            },
        },
        select: {
            id: true,
            orderId: true,
            amount: true,
            status: true,
            gatewayOrderId: true,
        },
    });

    if (!payment) {
        throw new ApiError(
            404,
            PAYMENT_MESSAGE.PAYMENT_NOT_FOUND
        );
    }

    // Idempotency
    if (payment.status === "PAID") {
        return payment;
    }

    if (!payment.gatewayOrderId) {
        throw new ApiError(
            400,
            PAYMENT_MESSAGE.PAYMENT_FAILED
        );
    }

    const result = await paymentGateway.verifyPayment(
        gatewayData,
        payment.gatewayOrderId,
        Number(payment.amount)
    );

    if (!result.success) {
        return prisma.$transaction(
            async (tx) => {
                await updatePaymentStatus(
                    tx,
                    payment.id,
                    "FAILED"
                );

                await tx.order.update({
                    where: {
                        id: payment.orderId,
                    },
                    data: {
                        paymentStatus: "FAILED",
                    },
                });

                throw new ApiError(
                    400,
                    PAYMENT_MESSAGE.PAYMENT_FAILED
                );
            }
        );
    }

    return prisma.$transaction(
        async (tx) => {
            const updatedPayment =
                await updatePaymentStatus(
                    tx,
                    payment.id,
                    "PAID",
                    result.transactionId
                );

            await tx.order.update({
                where: {
                    id: payment.orderId,
                },
                data: {
                    paymentStatus: "PAID",
                },
            });

            return updatedPayment;
        }
    );
};