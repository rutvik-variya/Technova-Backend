import { OrderStatus } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [
        "CONFIRMED",
        "CANCELLED",
    ],
    CONFIRMED: [
        "PROCESSING",
        "CANCELLED",
    ],
    PROCESSING: [
        "SHIPPED",
        "CANCELLED",
    ],
    SHIPPED: [
        "DELIVERED",
    ],
    DELIVERED: [],
    CANCELLED: [],
    RETURNED: [],
}

export const validateOrderStatusTransition = (
    currentStatus: OrderStatus,
    nextStatus: OrderStatus
) => {

    if (currentStatus === nextStatus) {
        throw new ApiError(
            400,
            ORDER_MESSAGE.ORDER_ALREADY_IN_STATUS
        );
    }

    const allowed = allowedTransitions[currentStatus] ?? [];

    if (!allowed.includes(nextStatus)) {
        throw new ApiError(
            400,
            ORDER_MESSAGE.INVALID_STATUS_TRANSITION
        );
    }
    return true;
};