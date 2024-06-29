const { Order, Order_item, Payment, Shipping, sequelize } = require('../sequelize/models');

class orderController {
    static async createOrder(req, res, next) {
        const { userId, products, date, payment, shipping } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const order = await Order.create(
                { userId, date },
                { transaction }
            );

            const orderItems = products.map(product => ({
                orderId: order.id,
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
            }));

            await Order_item.bulkCreate(orderItems, { transaction });

            const paymentData = {
                orderId: order.id,
                paymentMethod: payment.paymentMethod,
                amount: payment.amount,
            };
            await Payment.create(paymentData, { transaction });

            const shippingData = {
                orderId: order.id,
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
