export const calculateOrderTotals = (
    items: any[]
) => {
    const subtotal = items.reduce(
        (total, item) => {
            const price = Number(item.variant.price)
            return total + price * item.quantity
        }, 0
    )

    const discount = 0;
    const shippingCharge = 0;
    const tax = 0;

    const grandTotal = subtotal - discount + shippingCharge + tax;

    return {
        subtotal,
        discount,
        shippingCharge,
        tax,
        grandTotal
    }
}