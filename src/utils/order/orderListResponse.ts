export const orderListResponse = (
    orders: any[]
) => {

    return orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingCharge: Number(order.shippingCharge),
        tax: Number(order.tax),
        grandTotal: Number(order.grandTotal),
        itemCount: order._count.orderItems,
        createdAt: order.createdAt,
    }));
};