const { Router } = require('express');
const orderController = require('../controllers/orderController');

const orderRouter = Router();

orderRouter.post('/orders', orderController.createOrder);

module.exports = orderRouter;
