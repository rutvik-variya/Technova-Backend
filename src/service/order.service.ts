import prisma from "../lib/prisma";
import { CreateOrderDto } from "../types/order.types";
import { ApiError } from "../utils/ApiError";

export const createOrderService = async (
    userId: string,
    payload: CreateOrderDto
) => {

    
};