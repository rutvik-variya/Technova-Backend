import crypto from "node:crypto";

import razorpay from "../../config/razorpay";
import { env } from "../../config/env";
import {
    VerifyPaymentDto,
} from "../../types/payment.types";
import { ApiError } from "../ApiError";

export const paymentGateway = {
    async createPaymentOrder(amount: number, orderId: string) {
        const amountInPaise = Math.round(amount * 100);

        if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
            throw new ApiError(400, "Invalid payment amount");
        }

        // Razorpay test-mode max (adjust per your account)
        const RAZORPAY_MAX_AMOUNT_PAISE = 100_000_00; // ₹1,00,000
        if (amountInPaise > RAZORPAY_MAX_AMOUNT_PAISE) {
            throw new ApiError(
                400,
                `Amount exceeds maximum amount allowed (₹${RAZORPAY_MAX_AMOUNT_PAISE / 100})`
            );
        }

        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: orderId,
            });

            return { gatewayOrderId: razorpayOrder.id };
        } catch (err: any) {
            // Razorpay SDK throws errors with .error.description
            const description =
                err?.error?.description ||
                err?.message ||
                "Failed to create Razorpay order";

            throw new ApiError(400, description);
        }
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
        const expectedAmountInPaise = Math.round(Number(expectedAmount) * 100);

        if (Math.round(Number(razorpayPayment.amount)) !== expectedAmountInPaise) {
            return { success: false };
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