const { Product } = require('../sequelize/models');
const crudService = require('../services/crudGeneric');
const MongoProduct = require('../mongo/models/MongoProduct');

class productController {
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
            const { data, error } = await crudService.destroy(Product, id);
            if (error) {
                return res.status(404).json({ error: error.message });
            }

            res.sendStatus(204);
        } catch (error) {
            console.error('Deletion error:', error);
            res.status(500).json({ error: 'An error occurred while deleting the product' });
        }
    }

    static async deleteMultiplesProducts(req, res) {
        const { productsId } = req.body;
        const ids = productsId.split(',');

        try {
            const deletionPromises = ids.map(async (id) => {
                const { data, error } = await crudService.destroy(Product, id);
                if (error) {
                    throw new Error(`Product with ID ${id} not found: ${error.message}`);
                }
            });

            await Promise.all(deletionPromises);

            res.sendStatus(204);
        } catch (error) {
            console.error('Deletion error:', error);
            res.status(500).json({ error: 'An error occurred while deleting the products' });
        }
    }

    // static async updateProduct(req, res) {
    //     const { data, error } = await crudService.update(Product, req.params.id, req.body);
    //     if (error) {
    //         return res.status(400).json({ error: error.message });
    //     }
    //     res.json({ product: data });
    // }

    static async getMongoProducts(req, res) {
        const limit = parseInt(req.query.limit) || 0;
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
        try {
            if (typeof req.params.id !== 'string' || !req.params.id.trim()) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const product = await MongoProduct.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ product: product });
        } catch (error) {
            return res.status(404).json({ error: 'Product not found' });
        }
    }

    static async getLast5MongoProduct(req, res) {
        const products = await MongoProduct.find().sort({ createdAt: -1 }).limit(5);
        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.json({ products: products });
    }

    static async updateProduct(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            const postgresUpdateData = { ...updateData };
            const { data, error } = await crudService.update(Product, id, postgresUpdateData);
            if (error) {
                return res.status(404).json({ error: 'Product not found in postgres' });
            }

            return res.json({ product: data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while updating the product' });
        }
    }
}

module.exports = productController;
