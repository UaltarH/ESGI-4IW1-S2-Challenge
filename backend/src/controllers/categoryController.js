const { Category } = require('../sequelize/models');
const { Op } = require('sequelize');

class CategoryController {
    static async getAllCategories(req, res) {
        console.log("all");
        try {
            const records = await Category.findAll();
            res.json({ categories: records });
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoryController;
