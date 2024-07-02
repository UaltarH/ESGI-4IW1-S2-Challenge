const { Order, Order_item, Payment, Shipping, sequelize, } = require('../sequelize/models');
const { createMongoOrder } = require('../services/mongoOrderService')

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
            const orderItemsRes = await Order_item.bulkCreate(orderItems, { transaction });

            const paymentData = {
                OrderId: order.id,
                paymentMethod: payment.paymentMethod,
                amount: payment.amount,
            };
            const paymentRes = await Payment.create(paymentData, { transaction });

            const shippingData = {
                OrderId: order.id,
                shippingMethod: shipping.shippingMethod,
                trackingNumber: shipping.trackingNumber,
                address: shipping.address,
                city: shipping.city,
                zipcode: shipping.zipcode,
                country: shipping.country,
            };
            const shippingRes = await Shipping.create(shippingData, { transaction });
            await transaction.commit();

            //create order in mongoDB
            await createMongoOrder(order, UserId, orderItemsRes, paymentRes, shippingRes);

            res.status(201).json({ success: true, order });


        } catch (error) {
            console.log(error);
            await transaction.rollback();
            next(error);
        }
    }
}

module.exports = orderController;
