const { Cart, Cart_item, sequelize } = require('../sequelize/models');

class cartController {
    static async createCart(req, res, next) {
        const { userId, products } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.create(
                { userId },
                { transaction }
            );

            const cartItems = products.map(product => ({
                cartId: cart.id,
                productId: product.productId,
                quantity: product.quantity,
            }));

            await Cart_item.bulkCreate(cartItems, { transaction });
            await transaction.commit();

            res.status(201).json({ success: true, cart });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    static async deleteCart(req, res, next) {
        const cartId = req.params.id;
        const transaction = await sequelize.transaction();

        try {
            await Cart_item.destroy({
                where: { cartId },
                transaction,
            });

            const nbDeleted = await Cart.destroy({
                where: { id: cartId },
                transaction,
            });
            await transaction.commit();

            if (nbDeleted === 1) {
                res.sendStatus(204);
            } else {
                res.status(404).json({ error: 'Cart not found' });
            }
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
}

module.exports = cartController;
