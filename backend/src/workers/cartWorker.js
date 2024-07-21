const { cartQueue } = require('../config/queueBullConfig');
const { Cart, Cart_item, Product, sequelize } = require('../sequelize/models');

cartQueue.process(async (job) => {
    const { cartId } = job.data;
    const transaction = await sequelize.transaction();

    try {
        const cart = await Cart.findByPk(cartId, {
            include: [{ model: Cart_item, include: [Product] }],
            transaction
        });

        if (!cart) {
            console.log(`Cart ${cartId} not found or already processed`);
            return;
        }

        // Mettre à jour le stock des produits
        for (const item of cart.Cart_items) {
            const product = await Product.findByPk(item.ProductId, { transaction });
            if (product) {
                product.stock += item.quantity;
                await product.save({ transaction });
            } else {
                console.error(`Product with id ${item.ProductId} not found`);
            }
        }

        await cart.destroy({ transaction });

        await transaction.commit();
        console.log(`Cart ${cartId} expired and stock updated`);
    } catch (error) {
        await transaction.rollback();
        console.error('Error processing cart expiration:', error);
    }
});