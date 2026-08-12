export const checkoutResponse = ({
    cart,
    address,
    totals,
}: {
    cart: any;
    address: any;
    totals: any;
}) => {

    return {
        items: cart.cartItems.map(
            (item: any) => ({
                id: item.id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                },

                variant: {
                    id: item.variant.id,
                    name: item.variant.name,
                    sku: item.variant.sku,
                },
                quantity: item.quantity,
                price: item.variant.price,
                total: item.variant.price.mul(item.quantity),
            })
        ),
        address,
        totals,
    };
};