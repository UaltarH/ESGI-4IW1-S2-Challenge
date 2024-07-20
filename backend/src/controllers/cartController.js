const { Cart, Cart_item, sequelize, Product } = require('../sequelize/models');
const { cartQueue } = require('../config/queueBullConfig');

class cartController {
    static async createCart(req, res, next) {
        const { id, UserId, products } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.create(
                { id, UserId },
                { transaction }
            );

            const cartItems = products.map(product => ({
                CartId: cart.id,
                ProductId: product.postgresId,
                quantity: product.quantity,
            }));

            await Cart_item.bulkCreate(cartItems, { transaction });
            await transaction.commit();

            // ajout de la tâche de suppression du panier dans 15 minutes
            await cartQueue.add(
                { cartId: cart.id },
                { delay: 15 * 60 * 1000 }
            );

            res.status(201).json({ cart });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
    static async getCart(req, res, next) {
        try {
            const cart = await Cart.findOne({
                where: { id: req.params.id },
                include: {
                    model: Cart_item,
                    as: 'items',
                },
            });

            if (cart) {
                res.status(200).json({ cart });
            } else {
                res.status(404).json({ error: 'Cart not found' });
            }
        } catch (error) {
            next(error);
        }
    }
    static async getCartByUserId(req, res, next) {
        const UserId = req.query.UserId;
        try {
            const cart = await Cart.findOne({
                where: { UserId: UserId },
                include:
                {
                    model: Cart_item,
                    include: {
                        model: Product,
                    },
                },
            });
            console.log('cart', cart);

            if (cart) {
                res.status(200).json({ cart });
            } else {
                res.status(404).json({ error: 'Cart not found' });
            }
        } catch (error) {
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
