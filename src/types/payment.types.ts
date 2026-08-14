import { PaymentMethod } from "@prisma/client";

export interface CreatePaymentDto {
    orderId: string,
    paymentMethod: PaymentMethod
}

export interface PaymentGateway {
    createPaymentOrder(
        amount: number,
        orderId: string
    ): Promise<{ gatewayOrderId: string }>

    verifyPayment(
        data: Record<string, string>
    ): Promise<{
        success: boolean,
        transactionId?: string
    }>
}

export const PAYMENT_MESSAGE = {
    ORDER_NOT_FOUND: "Order not found",
    PAYMENT_ALREADY_EXISTS: "Payment already exists",
    PAYMENT_NOT_FOUND: "Payment not found",
    INVALID_PAYMENT_METHOD: "Invalid payment method",
    INVALID_PAYMENT_STATUS: "Invalid payment status",
    PAYMENT_CREATED: "Payment created successfully",
    PAYMENT_SUCCESS: "Payment successful",
    PAYMENT_FAILED: "Payment failed",
    CANCEL_ORDER: "Cannot pay for a cancelled order"
}