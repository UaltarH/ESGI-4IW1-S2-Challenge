const { Product } = require('../sequelize/models');
const crudService = require('../services/crudGeneric');

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
}

module.exports = productController;
