export const cartResponse = (cart: any) => ({
    id: cart.id,
    subtotal: cart.subtotal,
    totalItem: cart.totalItem,
    items: cart.cartItems
})