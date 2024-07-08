const MongoProduct = require('../mongo/models/MongoProduct');

class SearchController {
    static async getProducts(req, res) {
        try {
            const searchTerm = req.query.search || '';
            const categoryName = req.query.category || '';
            const stock = req.query.stock === 'true' || false;

            console.log(categoryName);

            let mongoQuery = {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            };

            if (categoryName) {
                mongoQuery = {
                    ...mongoQuery,
                    category: categoryName
                };
            }

            if (stock) {
                mongoQuery = {
                    ...mongoQuery,
                    stock: { $gt: 0 }
                };
            }

            const records = await MongoProduct.find(mongoQuery);
            res.json({ products: records });
        } catch (error) {
            console.error('Erreur dans getProducts :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SearchController;
