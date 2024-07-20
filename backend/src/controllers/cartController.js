const { Cart, Cart_item, sequelize, Product } = require('../sequelize/models');

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

    static async updateCart(req, res, next) {
        const { id, UserId, products } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const cart = await Cart.findOne({
                where: { id, UserId },
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
}

module.exports = cartController;
