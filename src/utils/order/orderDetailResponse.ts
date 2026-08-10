export const orderDetailResponse = (order: any) => {
    return {
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

        address: {
            fullName: order.address.fullName,
            phone: order.address.phone,
            country: order.address.country,
            state: order.address.state,
            city: order.address.city,
            postalCode: order.address.postalCode,
            addressLine1: order.address.addressLine1,
            addressLine2: order.address.addressLine2,
            landmark: order.address.landmark,
        },

        items: order.orderItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSlug: item.productSlug,
            brand: item.brand,
            image: item.image,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
            createdAt: item.createdAt,
        })),

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};