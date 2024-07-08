const { Router } = require('express');
const productController = require('../controllers/productController');

const productRouter = Router();

productRouter.get('/products', productController.getProducts);
productRouter.get('/products/:id', productController.getProduct);
productRouter.post('/products', productController.createProduct);
productRouter.put('/products/:id', productController.updateProduct);
productRouter.delete('/products/:id', productController.deleteProduct);
productRouter.get('/mongoProducts', productController.getMongoProducts);
productRouter.get('/mongoProducts/last', productController.getLast5MongoProduct);
productRouter.get('/mongoProducts/:id', productController.getSpecificMongoProduct);

module.exports = productRouter;
