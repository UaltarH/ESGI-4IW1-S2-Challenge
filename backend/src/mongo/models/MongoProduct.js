const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    postgresId: String,
    name: String,
    description: String,
    price: Number,
    stock: Number,
    imagePath: String,
    threshold: Number,
    categoryId: String,
    categoryName: String,
    createdAt: Date,
    updatedAt: Date,
});

// Add text index for full text search (searchbar)
productSchema.index({ name: 'text', description: 'text', categoryName: 'text' });

const MongoProduct = mongoose.model('Product', productSchema, 'products');

module.exports = MongoProduct;
