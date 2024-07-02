const { Product } = require('../sequelize/models'); // Assurez-vous que le chemin est correct
const { Op } = require('sequelize');

class SearchController {
    static async getProducts(req, res) {
        try {
            const searchTerm = req.query.search || '';
            const query = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchTerm}%` } },
                    { description: { [Op.iLike]: `%${searchTerm}%` } }
                ]
            };

            const records = await Product.findAll({ where: query });
            res.json({ products: records });
        } catch (error) {
            console.error('Erreur dans getProducts :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SearchController;
