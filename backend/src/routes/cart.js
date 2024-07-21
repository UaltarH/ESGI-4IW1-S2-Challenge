const { Router } = require('express');
const cartController = require('../controllers/cartController');
const checkRole = require('../middlewares/cart/checkRole');
const cartRouter = Router();

cartRouter.get('/carts/:id', checkRole(), cartController.getCart);
cartRouter.get('/carts/user/:id', checkRole(), cartController.getCartByUserId);
cartRouter.post('/carts', checkRole(), cartController.createCart);
cartRouter.put('/carts/', checkRole(), cartController.updateCart);

module.exports = cartRouter;
