import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { getOrderForPayment } from "../utils/payment/getOrderForPayment";
import { CreatePaymentDto, PAYMENT_MESSAGE } from "../types/payment.types";
import { createPaymentRecord } from "../utils/payment/createPaymentRecord";
import { paymentResponse } from "../utils/payment/paymentResponse";

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