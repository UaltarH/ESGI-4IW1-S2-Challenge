const { Cart, Cart_item, sequelize, Product } = require('../sequelize/models');
const { cartQueue } = require('../config/queueBullConfig');

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
                ProductId: product.postgresId,
                quantity: product.quantity,
            }));
            await Cart_item.bulkCreate(cartItems, { transaction, individualHooks: true });
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
                    include: {
                        model: Product,
                    },
                },
            });

            if (cart) {
                res.status(200).json({ cart });
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            next(error);
        }
    }
    static async getCartByUserId(req, res, next) {
        const UserId = req.params.id;

        try {
            const cart = await Cart.findOne({
                where: {
                    UserId: UserId,
                },
                order: [['createdAt', 'DESC']],
                include:
                {
                    model: Cart_item,
                    include: {
                        model: Product,
                    },
                },
            });

            if (cart) {
                res.status(200).json({ cart });
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async updateCartUser(req, res, next) {
        const { id, UserId } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.findOne({
                where: { id },
                transaction,
            });

            if (cart) {
                await cart.update({ UserId }, { transaction });
                await transaction.commit();
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    static async updateCart(req, res, next) {
        const { id, products } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.findOne({
                where: { id },
                include: {
                    model: Cart_item,
                },
                transaction,
            });

            if (cart) {
                await Cart_item.destroy({
                    where: { CartId: cart.id },
                    individualHooks: true,
                    transaction,
                });
                const cartItems = products.map(product => ({
                    CartId: cart.id,
                    ProductId: product.postgresId,
                    quantity: product.quantity,
                }));

                await Cart_item.bulkCreate(cartItems, { transaction, individualHooks: true });
                await transaction.commit();

                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
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
                individualHooks: true,
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
