const { Router } = require('express');
const productController = require('../controllers/productController');
const checkRole = require('../middlewares/product/checkRole');

const productRouter = Router();

productRouter.get('/products/:id', productController.getProduct);
productRouter.get('/mongoProducts', productController.getMongoProducts);
productRouter.get('/mongoProducts/:id', productController.getSpecificMongoProduct);
productRouter.get('/mongoProducts/last', productController.getLast5MongoProduct);
productRouter.put('/mongoProducts/:id', checkRole(), productController.updateProduct);
productRouter.delete('/products/:id', productController.deleteProduct);
productRouter.delete('/products', productController.deleteMultiplesProducts);
productRouter.put('/products/:id', checkRole(), productController.updateProduct);

module.exports = productRouter;
