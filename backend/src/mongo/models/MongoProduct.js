const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    postgresId: String,
    name: String,
    description: String,
    price: Number,
    stock: Number,
    categoryId: String,
    categoryName: String,
    deleteAt: Date,
});

const MongoProduct = mongoose.model('Product', productSchema);

module.exports = MongoProduct;
