const { Router } = require('express');
const orderController = require('../controllers/orderController');

const orderRouter = Router();

orderRouter.post('/orders', orderController.createOrderV1);
orderRouter.post('/orders/updateShippingStatus', orderController.updateShippingStatus);
orderRouter.get('/orders', orderController.getAllOrders);
orderRouter.get('/orders/:id', orderController.createPdfOrder);
orderRouter.post('/orders/payment', orderController.createOrder);
orderRouter.get('/orders/payment/:stripeId', orderController.handleAfterRequestOrder);

module.exports = orderRouter;
