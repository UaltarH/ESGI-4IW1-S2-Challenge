const { Router } = require('express');
const cartController = require('../controllers/cartController');
const checkRole = require('../middlewares/cart/checkRole');
const cartRouter = Router();

cartRouter.post('/carts', checkRole(), cartController.createCart);
cartRouter.get('/carts/user/:id', checkRole(), cartController.getCartByUserId);
cartRouter.put('/carts/', checkRole(), cartController.updateCart);
cartRouter.patch('/carts/', checkRole(), cartController.updateCartUser);
cartRouter.delete('/carts/:id', checkRole(), cartController.deleteCart);

module.exports = cartRouter;
