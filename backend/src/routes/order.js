const { Router } = require('express');
const orderController = require('../controllers/orderController');
const checkRole = require("../middlewares/order/checkRole.js");

const orderRouter = Router();

orderRouter.get('/orders', checkRole(), orderController.getAllOrders);
orderRouter.get('/orders/:id', checkRole(), orderController.createPdfOrder);
orderRouter.post('/orders/payment', checkRole(), orderController.createOrder);
orderRouter.get('/orders/payment/:stripeId', checkRole(), orderController.handleAfterRequestOrder);
orderRouter.get('/orders/user/:id', checkRole(), orderController.getAllOrdersForUser);
orderRouter.post('/orders/updateShippingStatus', checkRole(), orderController.updateShippingStatus);

module.exports = orderRouter;
