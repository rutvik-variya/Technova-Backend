import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { getOrderForPayment } from "../utils/payment/getOrderForPayment";
import { CreatePaymentDto, PAYMENT_MESSAGE } from "../types/payment.types";
import { createPaymentRecord } from "../utils/payment/createPaymentRecord";
import { paymentResponse } from "../utils/payment/paymentResponse";
import { paymentGateway } from "../utils/payment/paymentGateway";
import { updatePaymentStatus } from "../utils/payment/updatePaymentStatus";

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
    const order = await getOrderForPayment(
        prisma,
        userId,
        orderId
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

    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            amount: order.grandTotal,
            method: "ONLINE",
            status: "PROCESSING"
        },
        select: {
            id: true,
            orderId: true,
            amount: true,
            method: true,
            status: true,
        },
    })

    const gateWayOrder = await paymentGateway.createPaymentOrder(Number(order.grandTotal), order.id);

    await prisma.payment.update({
        where: {
            id: payment.id
        },
        data: {
            gatewayOrderId: gateWayOrder.gatewayOrderId
        }
    })

    return {
        paymentId: payment.id,
        orderId: order.id,
        amount: order.grandTotal,
        gatewayOrderId: gateWayOrder.gatewayOrderId
    }
}

export const verifyPaymentService = async (
    userId: string,
    paymentId: string,
    gatewayData: Record<string, string>
) => {

    const payment = await prisma.payment.findFirst({
        where: {
            id: paymentId,
            order: {
                userId
            }
        },
        select: {
            id: true,
            orderId: true,
            status: true
        }
    })

    if (!payment) {
        throw new ApiError(404, PAYMENT_MESSAGE.PAYMENT_NOT_FOUND)
    }

    if (payment.status === "PAID") {
        return payment
    }

    const result = await paymentGateway.verifyPayment(gatewayData);

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
                throw new ApiError(400, PAYMENT_MESSAGE.PAYMENT_FAILED);
            }
        );
    }

    return prisma.$transaction(
        async (tx) => {
            const updatedPayment = await updatePaymentStatus(
                tx,
                payment.id,
                "PAID",
                result.transactionId
            )
            await tx.order.update({
                where: {
                    id: payment.orderId
                },
                data: {
                    paymentStatus: "PAID"
                }
            })
            return updatedPayment;
        }
    )
}
