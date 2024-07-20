const afterCreateHook = async (cartItem, options) => {
    try {
        await cartItem.sequelize.models.Product.decrement(
            { stock: cartItem.quantity },
            { where: { id: cartItem.ProductId } }
        );
    } catch (error) {
        console.error('Error while decrementing product stock:', error);
        throw error;
    }
}
const afterDestroyHook = async (cartItem, options) => {
    try {
        await cartItem.sequelize.models.Product.increment(
            { stock: cartItem.quantity },
            { where: { id: cartItem.ProductId } }
        );
    } catch (error) {
        console.error('Error while incrementing product stock:', error);
        throw error;
    }
}
module.exports = {
    afterCreateHook,
    afterDestroyHook,
};
