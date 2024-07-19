const { Router } = require('express');
const cartController = require('../controllers/cartController');
const cartRouter = Router();

cartRouter.post('/carts', cartController.createCart);
cartRouter.get('/carts', cartController.getCartByUserId);
cartRouter.get('/carts/:id', cartController.getCart);
cartRouter.delete('/carts/:id', cartController.deleteCart);


module.exports = cartRouter;
