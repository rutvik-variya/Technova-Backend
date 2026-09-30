import crypto from "node:crypto";

import razorpay from "../../config/razorpay";
import { env } from "../../config/env";
import {
    VerifyPaymentDto,
} from "../../types/payment.types";

export const paymentGateway = {
    async createPaymentOrder(
        amount: number,
        orderId: string
    ) {
        const amountInPaise = Math.round(amount * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: orderId,
        });

        return {
            gatewayOrderId: razorpayOrder.id,
        };
    },

    async verifyPayment(
        data: VerifyPaymentDto,
        expectedGatewayOrderId: string,
        expectedAmount: number
    ) {
        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = data;

        // 1. Verify Razorpay order ID
        if (razorpayOrderId !== expectedGatewayOrderId) {
            return {
                success: false,
            };
        }

        // 2. Verify Razorpay signature
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${expectedGatewayOrderId}|${razorpayPaymentId}`
            )
            .digest("hex");

        const isValidSignature =
            generatedSignature === razorpaySignature;

        if (!isValidSignature) {
            return {
                success: false,
            };
        }

        // 3. Fetch payment directly from Razorpay
        const razorpayPayment =
            await razorpay.payments.fetch(
                razorpayPaymentId
            );

        // 4. Verify Razorpay payment belongs
        // to our Razorpay order
        if (
            razorpayPayment.order_id !==
            expectedGatewayOrderId
        ) {
            return {
                success: false,
            };
        }

        // 5. Verify amount
        const expectedAmountInPaise =
            Math.round(expectedAmount * 100);

        if (
            razorpayPayment.amount !==
            expectedAmountInPaise
        ) {
            return {
                success: false,
            };
        }

        // 6. Verify payment is captured
        if (razorpayPayment.status !== "captured") {
            return {
                success: false,
            };
        }

        return {
            success: true,
            transactionId: razorpayPayment.id,
        };
    },
};