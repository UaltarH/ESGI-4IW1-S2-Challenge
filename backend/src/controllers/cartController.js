const { Cart, Cart_item, sequelize } = require('../sequelize/models');

class cartController {
    static async createCart(req, res, next) {
        const { UserId, products } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.create(
                { UserId },
                { transaction }
            );

            const cartItems = products.map(product => ({
                CartId: cart.id,
                ProductId: product.productId,
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
        const CartId = req.params.id;
        const transaction = await sequelize.transaction();

        try {
            await Cart_item.destroy({
                where: { CartId },
                transaction,
            });

            const nbDeleted = await Cart.destroy({
                where: { id: CartId },
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
