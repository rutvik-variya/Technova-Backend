import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ORDER_MESSAGE } from "../types/order.types";
import { cancelOrderService, createOrderService, getAllOrdersService, getMyOrdersService, getOrderService, getOrderStatusHistoryService, updateOrderStatusService } from "../service/order.service";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

export const createOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const order = await createOrderService(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                ORDER_MESSAGE.ORDER_CREATED,
                order
            )
        );
    }
);

export const getMyOrders = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const result = await getMyOrdersService(
            req.user.id,
            req.query
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDERS_FETCHED,
                result
            )
        );
    }
);

export const getOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

        const { orderId: rawOrderId } = req.params;
        const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

        const order = await getOrderService(req.user.id, orderId);

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDER_FETCHED,
                order
            )
        );
    }
);

export const cancelOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

        const { orderId: rawOrderId } = req.params;
        const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

        const order = await cancelOrderService(
            req.user.id,
            orderId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDER_CANCELLED,
                order
            )
        );
    }
);

export const getAllOrders = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await getAllOrdersService(
            req.query
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDERS_FETCHED,
                result
            )
        );
    }
);

export const updateOrderStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { orderId: rawOrderId } = req.params;
        const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
        const { status, note } = req.body;

        const adminId = req.user.id;
        const order = await updateOrderStatusService(
            orderId,
            adminId,
            {
                status,
                note
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDER_STATUS_UPDATED,
                order
            )
        );
    }
);


export const getOrderStatusHistory = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { orderId: rawOrderId } = req.params;
        const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

        const history = await getOrderStatusHistoryService(
            orderId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ORDER_MESSAGE.ORDER_TIMELINE_FETCH,
                history
            )
        );
    }
);

