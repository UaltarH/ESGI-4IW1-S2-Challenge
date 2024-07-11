const { Router } = require('express');
const orderController = require('../controllers/orderController');

const orderRouter = Router();

orderRouter.post('/orders', orderController.createOrder);
orderRouter.post('/orders/updateShippingStatus', orderController.updateShippingStatus);
orderRouter.get('/orders', orderController.getAllOrders);

module.exports = orderRouter;
