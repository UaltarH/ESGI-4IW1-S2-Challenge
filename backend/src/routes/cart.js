const { Router } = require('express');
const cartController = require('../controllers/cartController');
const cartRouter = Router();

cartRouter.post('/carts', cartController.createCart);
cartRouter.delete('/carts/:id', cartController.deleteCart);


module.exports = cartRouter;
