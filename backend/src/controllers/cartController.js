const { Cart, Cart_item, sequelize, Product } = require('../sequelize/models');

class cartController {
    static async createCart(req, res, next) {
        console.log('========== Creating cart ==========');
        const { UserId, products } = req.body;
        const transaction = await sequelize.transaction();
        console.log('UserId : ', UserId);
        console.log('Products : ', products);
        try {
            const cart = await Cart.create(
                { UserId },
                { transaction }
            );
            console.log('========== Cart created');
            console.log(UserId ? 'User id : ' + UserId : 'Guest');
            console.log('Cart id : ', cart.id);
            const cartItems = products.map(product => ({
                CartId: cart.id,
                ProductId: product.postgresId,
                quantity: product.quantity,
            }));
            console.log('========== Cart items created');
            await Cart_item.bulkCreate(cartItems, { transaction, individualHooks: true });
            await transaction.commit();
            res.status(201).json({ cart });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
    static async getCartByUserId(req, res, next) {
        console.log('========== Getting cart by user id ==========');
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
                console.log('========== Cart found');
                res.status(200).json({ cart });
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async updateCartUser(req, res, next) {
        console.log('========== Updating cart owner ==========');
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
                console.log('========== Cart updated');
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
        console.log('========== Updating cart ==========');
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
