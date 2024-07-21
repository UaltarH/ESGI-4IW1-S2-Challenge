const MongoOrder = require('../mongo/models/MongoOrder');
const { Order, Payment, Shipping, Order_status, Cart } = require('../sequelize/models');
const { createStripeSession } = require('../services/stripeSession');
const { createOrderTransac } = require('../services/createOrder');
const { model } = require('mongoose');
const { cartQueue } = require('../config/queueBullConfig')


class orderController {
    static async createOrderV1(req, res, next) {
        try {
            const { orderItems, userId, date, total, shipping } = req.body;

            // await createOrderTransac(userId, date, orderItems, total, "test stripe id", shipping);

            res.status(200).send({ sessionId: session.id });
        }
        catch (error) {
            res.sendStatus(500);
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
            const orderstatus = await Order_status.create({ status, OrderId: shipping.OrderId });

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

    static async getAllOrdersForUser(req, res, next) {
        try {
            const userId = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const orders = await MongoOrder.find({ 'user.userId': userId })
                .skip(skip)
                .limit(limit);

            const totalOrders = await MongoOrder.countDocuments({ 'user.userId': userId });

            res.json({
                orders: orders,
                totalOrders: totalOrders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit)
            });
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

    static async createOrder(req, res, next) {
        try {
            const { orderItems, userId, date, total, shipping } = req.body;

            const session = await createStripeSession(orderItems);

            await createOrderTransac(userId, date, orderItems, total, session.id, shipping);

            res.status(200).send({ sessionId: session.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async handleAfterRequestOrder(req, res, next) {
        try {
            //TODO: make midleware for security reasons, we should check if the user is the owner of the order

            const stripeSession = req.params.stripeId;
            const order = await Order.findOne({
                include: [{
                    model: Payment,
                    where: { stripeSessionId: stripeSession }
                }]
            });

            //check if order exists
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            //security : check if we already have status confirmed for this order
            const orderStatusConfirm = await Order_status.findOne({
                where: {
                    OrderId: order.id,
                    status: "Confirmée"
                }
            });

            if (orderStatusConfirm) {
                return res.status(200).json({ message: "Order already confirmed" });
            }

            // check in query params if payment was successful
            if (req.query.status === "true") {
                await Order_status.create({ status: "Confirmée", OrderId: order.id });
                const deletedCart = await Cart.destroy({
                    where: { UserId: order.UserId },
                    returning: true,
                    plain: true
                });

                //remove the worker for this cart
                const jobs = await cartQueue.getJobs(['delayed']);
                const cartJob = jobs.find(job => job.data.cartId === deletedCart.id);
                if (cartJob) {
                    await cartJob.remove();
                }

                return res.status(200).json({ message: "Order confirmed" });
            } else if (req.query.status === "false") {
                await Order.destroy({ where: { id: order.id } });

                return res.status(200).json({ message: "Order cancel" });
            } else {
                return res.status(400).json({ message: "Invalid status" });
            }
        } catch (error) {
            console.error("Error processing order confirmation:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // todo : create a function to call fake api laposte to get a number tracking
}

// const response = await fetch("http://laposteapi:7000/shipping", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 shippingMethod: shipping.shippingMethod,
//                 address: shipping.address,
//                 city: shipping.city,
//                 zipcode: shipping.zipcode,
//                 country: shipping.country
//             })
//         });

//         const trackingNumber = await response.text();

module.exports = orderController;
