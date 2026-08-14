import { PaymentGateway } from "../../types/payment.types";

export const paymentGateway: PaymentGateway = {
    async createPaymentOrder(
        amount,
        orderId
    ) {
        return {

            // gateway integration will be here
            gatewayOrderId: `TEMP-${orderId}`
        }
    },

    async verifyPayment(data) {
        // Gateway signature verification
        // will be implemented here.

        return {
            success: false,
        }
    }
}