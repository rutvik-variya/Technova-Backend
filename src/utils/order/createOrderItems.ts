export const createOrderItem = (
    items: any[]
) => {
    return items.map((item) => {
        const unitPrice = Number(item.variant.price)
        const totalPrice = unitPrice * item.quantity;

        return {
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            productSlug: item.product.slug,
            brand: item.product.brand,

            sku: item.variant.sku,
            quantity: item.quantity,

            unitPrice,
            totalPrice
        }
    })
}

