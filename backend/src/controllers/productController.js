const { Product } = require('../sequelize/models');
const crudService = require('../services/crudGeneric');
const MongoProduct = require('../mongo/models/MongoProduct');

class productController {
    static async getProducts(req, res) {
        const { data, error } = await crudService.findAll(Product, req.query);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ products: data });
    }

    static async createProduct(req, res, next) {
        const { data, error } = await crudService.create(Product, req.body);
        if (error) {
            return next(error);
        }
        res.status(201).json({ success: true, product: data });
    }

    static async getProduct(req, res) {
        console.log("passage dans getProduct");
        const { data, error } = await crudService.findByPk(Product, req.params.id);
        if (error) {
            return res.status(404).json({ error: error.message });
        }
        res.status(200).json({ product: data });
    }

    static async deleteProduct(req, res) {
        const { data, error } = await crudService.destroy(Product, req.params.id);
        if (error) {
            return res.status(404).json({ error: error.message });
        }
        res.sendStatus(204);
    }

    static async updateProduct(req, res) {
        const { data, error } = await crudService.update(Product, req.params.id, req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ product: data });
    }

    static async getMongoProducts(req, res) {
        const products = await MongoProduct.find();
        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.json({ products: products });
    }

    static async getSpecificMongoProduct(req, res) {
        const id = req.params.id
        if (!id || id.trim() === '') {
            return res.status(400).json({ status: 'failed', message: 'Invalid Product ID' });
        }
        const product = await Product.findOne({ postgresId: id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product: product });
    }

    static async getLast5MongoProduct(req, res) {
        const products = await MongoProduct.find().sort({ createdAt: -1 }).limit(5);
        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.json({ products: products });
    }
}

module.exports = productController;
