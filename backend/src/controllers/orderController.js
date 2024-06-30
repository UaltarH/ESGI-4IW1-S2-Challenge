const { Order, Order_item, Payment, Shipping, sequelize } = require('../sequelize/models');

class orderController {
    static async createOrder(req, res, next) {
        const { UserId, products, date, payment, shipping } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const order = await Order.create(
                { UserId, date },
                { transaction }
            );
            const orderItems = products.map(product => ({
                OrderId: order.id,
                ProductId: product.productId,
                quantity: product.quantity,
                price: product.price,
            }));

            await Order_item.bulkCreate(orderItems, { transaction });

            const paymentData = {
                OrderId: order.id,
                paymentMethod: payment.paymentMethod,
                amount: payment.amount,
            };
            await Payment.create(paymentData, { transaction });

            const shippingData = {
                OrderId: order.id,
                shippingMethod: shipping.shippingMethod,
                trackingNumber: shipping.trackingNumber,
            };
            await Shipping.create(shippingData, { transaction });
            await transaction.commit();

            res.status(201).json({ success: true, order });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
}

module.exports = orderController;
