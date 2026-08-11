import { OrderStatus } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

const CANCELLABLE_STATUSES: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
];

export const canCancelOrder = (
    status: OrderStatus
) => {
    if (!CANCELLABLE_STATUSES.includes(status)) {
        throw new ApiError(
            400,
            ORDER_MESSAGE.ORDER_CANNOT_BE_CANCELLED
        );
    }
    return true;
};