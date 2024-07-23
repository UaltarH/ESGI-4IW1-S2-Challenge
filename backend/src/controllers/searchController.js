const MongoProduct = require('../mongo/models/MongoProduct');
const { escapeRegex, normalizeString, cleanQuantity } = require('../services/cleanUtils');
class SearchController {
    static async getProducts(req, res) {
        try {
            const searchTerm = escapeRegex(normalizeString(req.query.search || '') );
            const categoryName = req.query.category || '';
            const stock = req.query.stock === 'true' || false;
            const limit = 9;
            const offset = (cleanQuantity(req.query.skip, 0, 9999) || 0);

            let mongoQuery = {};
            let sortOptions = {};

            if (searchTerm) {
                mongoQuery.$text = {
                    $search: searchTerm,
                    $caseSensitive: false,
                    $diacriticSensitive: false
                };
                sortOptions = { score: { $meta: "textScore" } };
            }

            if (categoryName) {
                mongoQuery.categoryName = categoryName;
            }

            if (stock) {
                mongoQuery.stock = { $gt: 0 };
            }

            const records = await MongoProduct.find(mongoQuery)
                .sort(sortOptions)
                .limit(limit)
                .skip(offset);
            const count = await MongoProduct.countDocuments(mongoQuery);

            res.json({ products: records, totalCount: count });
        } catch (error) {
            console.error('Erreur dans getProducts :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SearchController;
