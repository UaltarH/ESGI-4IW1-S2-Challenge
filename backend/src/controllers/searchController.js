const { Product, Category } = require('../sequelize/models'); 
const { Op } = require('sequelize');

class SearchController {
    static async getProducts(req, res) {
        try {
            const searchTerm = req.query.search || '';
            const categoryName = req.query.category || '';
            const stock = req.query.stock === 'true' || false;

            let query = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchTerm}%` } },
                    { description: { [Op.iLike]: `%${searchTerm}%` } }
                ],
            };

            if (categoryName) {
                const category = await Category.findAll({ where: {name: categoryName} });
                if (category && category.length === 1) {
                    console.log(category);
                    query = {
                        ...query,
                        CategoryId: category[0].dataValues.id
                    }
                }
            }
            if (stock) {
                query = {
                    ...query,
                    stock: {
                        [Op.gt]: 0
                    }
                };
            }

            const records = await Product.findAll({ where: query });
            res.json({ products: records });
        } catch (error) {
            console.error('Erreur dans getProducts :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SearchController;
