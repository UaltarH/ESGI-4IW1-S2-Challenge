const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    postgresId: String,
    name: String,
    createdAt: Date,
    updatedAt: Date,
});

const MongoCategory = mongoose.model('Category', categorySchema);

module.exports = MongoCategory;
