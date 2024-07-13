const { Product } = require('../sequelize/models');
const crudService = require('../services/crudGeneric');
const mongoose = require('mongoose');
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
        const { data, error } = await crudService.findByPk(Product, req.params.id);
        if (error) {
            return res.status(404).json({ error: error.message });
        }
        res.status(200).json({ product: data });
    }

    static async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            const deletedProduct = await MongoProduct.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found in MongoDB' });
            }

            const { data, error } = await crudService.destroy(Product, deletedProduct.postgresId);
            if (error) {
                return res.status(404).json({ error: error.message });
            }

            res.sendStatus(204);
        } catch (error) {
            console.error('Deletion error:', error);
            res.status(500).json({ error: 'An error occurred while deleting the product' });
        }
    }

    static async updateProduct(req, res) {
        const { data, error } = await crudService.update(Product, req.params.id, req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ product: data });
    }

    static async getMongoProducts(req, res) {
        const limit = parseInt(req.query.limit) || 9;
        const skip = parseInt(req.query.skip) || 0;
        const maxPrice = parseFloat(req.query.maxPrice);
        const categories = req.query.categories ? req.query.categories.split(',') : [];

        const filter = {};

        if (!isNaN(maxPrice)) {
            filter.price = { $lte: maxPrice };
        }

        if (categories.length > 0) {
            filter.categoryId = { $in: categories };
        }

        try {
            const products = await MongoProduct.find(filter).limit(limit).skip(skip);
            const maxPriceProduct = await MongoProduct.findOne().sort({ price: -1 });
            const minPriceProduct = await MongoProduct.findOne().sort({ price: 1 });
            let count = await MongoProduct.countDocuments(filter);

            res.json({
                products: products,
                totalCount: count,
                maxPrice: maxPriceProduct.price,
                minPrice: minPriceProduct.price
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    static async getSpecificMongoProduct(req, res) {
        const product = await MongoProduct.findById(req.params.id);
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

    static async updateMongoProduct(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            const updatedProduct = await MongoProduct.findByIdAndUpdate(id, updateData, { new: true, runValidators: true});
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            const postgresUpdateData = { ...updateData, CategoryId: updateData.categoryId };
            delete postgresUpdateData.categoryId;
            const { data, error } = await crudService.update(Product, updatedProduct.postgresId, postgresUpdateData);
            if (error) {
                return res.status(404).json({ error: 'Product not found in postgres' });
            }

            return res.json({ product: updatedProduct });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while updating the product' });
        }
    }
}

module.exports = productController;
