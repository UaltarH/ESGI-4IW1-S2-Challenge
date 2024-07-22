const { Router } = require('express');
const orderController = require('../controllers/orderController');
const checkRole = require("../middlewares/order/checkRole.js");

const orderRouter = Router();

orderRouter.get('/orders', orderController.getAllOrders);
orderRouter.get('/orders/:id', orderController.createPdfOrder);
orderRouter.post('/orders/payment', orderController.createOrder);
orderRouter.get('/orders/payment/:stripeId', orderController.handleAfterRequestOrder);
orderRouter.get('/orders/user/:id', checkRole(), orderController.getAllOrdersForUser);
orderRouter.post('/orders/updateShippingStatus', orderController.updateShippingStatus);

module.exports = orderRouter;
