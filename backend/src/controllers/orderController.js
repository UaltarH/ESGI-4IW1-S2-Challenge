const MongoOrder = require('../mongo/models/MongoOrder');
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

            const response = await fetch("http://laposteapi:7000/shipping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shippingMethod: shipping.shippingMethod,
                    address: shipping.address,
                    city: shipping.city,
                    zipcode: shipping.zipcode,
                    country: shipping.country
                })
            });
            
            const trackingNumber = await response.text();

            const shippingData = {
                OrderId: order.id,
                shippingMethod: shipping.shippingMethod,
                trackingNumber: trackingNumber,
                status: "En attente",
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
    
    static async updateShippingStatus(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const trackingNumber = req.body.trackingNumber;
            const status = req.body.status;
    
            const mongoUpdateResult = await MongoOrder.updateOne(
                { 'shipping.trackingNumber': trackingNumber },
                { $set: { 'shipping.status': status } }
            );

            if (mongoUpdateResult.modifiedCount === 0) {
                return res.status(404).json({ message: 'No orders found in MongoDB with the given tracking number' });
            }
    
            const [updated] = await Shipping.update(
                { status: status },
                { where: { trackingNumber: trackingNumber }, transaction }
            );
    
            if (updated === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Shipping not found in PostgreSQL' });
            }
    
            await transaction.commit();
            return res.json("ok");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async getAllOrders(req, res, next) {
        try {
            const order = await MongoOrder.find(); 
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


module.exports = orderController;
