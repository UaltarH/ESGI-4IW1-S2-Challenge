const { Order, Order_item, Payment, Shipping, sequelize, Order_status } = require('../sequelize/models');

const createOrderTransac = async (userId, date, orderItemsInput, total, stripeSessionId, shipping) => {
    const transaction = await sequelize.transaction();
    const orderNumber = Math.floor(Math.random() * 1000000);
    try {
        const order = await Order.create(
            { UserId: userId, orderNumber, date },
            { transaction }
        );
        const orderItems = orderItemsInput.map(item => ({
            OrderId: order.id,
            ProductId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        for (const orderItem of orderItems) {
            await Order_item.create(orderItem, { transaction });
        }

        const paymentData = {
            OrderId: order.id,
            stripeSessionId: stripeSessionId,
            amount: total,
        };
        await Payment.create(paymentData, { transaction });


        const shippingData = {
            OrderId: order.id,
            shippingMethod: shipping.shippingMethod,
            trackingNumber: null,
            address: shipping.address,
            city: shipping.city,
            zipcode: shipping.zipcode,
            country: shipping.country,
        };
        await Shipping.create(shippingData, { transaction });

        const orderStatusData = {
            OrderId: order.id,
            status: "En attente",
        };
        await Order_status.create(orderStatusData, { transaction });

        await transaction.commit();

        return;


    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return;
    }
};
module.exports = {
    createOrderTransac,
};