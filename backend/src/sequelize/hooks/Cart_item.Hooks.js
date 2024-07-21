const afterCreateHook = async (cartItem, options) => {
    try {
        const product = await cartItem.sequelize.models.Product.findByPk(cartItem.ProductId);
        if (product) {
            product.stock -= cartItem.quantity;
            await product.save();
        } else {
            console.error(`Product with id ${item.ProductId} not found` );
        }
    } catch (error) {
        console.error('Error while decrementing product stock:', error);
        throw error;
    }
}
const afterDestroyHook = async (cartItem, options) => {
    try {
        const product = await cartItem.sequelize.models.Product.findByPk(cartItem.ProductId);
        if (product) {
            product.stock += cartItem.quantity;
            await product.save();
        } else {
            console.error(`Product with id ${item.ProductId} not found` );
        }
    } catch (error) {
        console.error('Error while incrementing product stock:', error);
        throw error;
    }
}
module.exports = {
    afterCreateHook,
    afterDestroyHook,
};
