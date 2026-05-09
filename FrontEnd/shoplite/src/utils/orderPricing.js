export const calculateOrderTotal = (
    items = [],
    options = {}
) => {

    const {
        taxPercentage = 4,
        deliveryFee = 0,
        discount = 0,
    } = options;

    const subtotal = items.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );

    const tax =
        subtotal * (taxPercentage / 100);

    const total =
        subtotal +
        tax +
        deliveryFee -
        discount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
};