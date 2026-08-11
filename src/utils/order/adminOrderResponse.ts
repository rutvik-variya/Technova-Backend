export const adminOrderResponse = (
    orders: any[]
) => {
    return orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
        },
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCharge: order.shippingCharge,
        tax: order.tax,
        grandTotal: order.grandTotal,
        itemCount: order._count.orderItems,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    })
    )
}