const MongoOrder = require('../mongo/models/MongoOrder');
const { Order, Order_item, Payment, Shipping, sequelize, Order_status } = require('../sequelize/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


class orderController {
    static async createOrder(req, res, next) {
        const { UserId, products, date, payment, shipping, totalPrice } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const order = await Order.create(
                { UserId, date, totalPrice },
                { transaction }
            );
            const orderItems = products.map(product => ({
                OrderId: order.id,
                ProductId: product.productId,
                quantity: product.quantity,
                price: product.price,
            }));
            for (const orderItem of orderItems) {
                await Order_item.create(orderItem, { transaction });
            }

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

            const orderStatusData = {
                OrderId: order.id,
                status: "En attente",
            };
            await Order_status.create(orderStatusData, { transaction });

            await transaction.commit();

            res.status(201).json({ success: true, order });


        } catch (error) {
            console.log(error);
            await transaction.rollback();
            next(error);
        }
    }

    static async updateShippingStatus(req, res, next) {
        try {
            const trackingNumber = req.body.trackingNumber;
            const status = req.body.status;

            const shipping = await Shipping.findOne({ where: { trackingNumber } });
            if (!shipping) {
                return res.status(404).json({ message: "Shipping not found" });
            }
            await Order_status.create({ status, OrderId: shipping.OrderId });

            return res.status(200).json({ message: "Shipping status updated" });
        } catch (error) {
            res.status(500).json({ message: "Erreur interne, veuillez réessayer" });
        }
    }

    static async getAllOrders(req, res, next) {
        try {
            const order = await MongoOrder.find();
            res.json({ orders: order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createPdfOrder(req, res, next) {
        try {
            const order = await MongoOrder.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.render('invoice', order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async creatPaymentIntent(req, res, next) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Your Product Name',
                        },
                        unit_amount: 10000, // 100 EUR in cents
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'http://localhost:5173/',
                cancel_url: 'http://localhost:5173/products',
            });

            res.status(200).send({ sessionId: session.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = orderController;
