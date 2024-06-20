const {Products} = require('../mock/data.js')

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// const productSchema = new mongoose.Schema({
//   productId: Number,
//   name: String,
//   description: String,
//   price: Number,
//   stock: Number,
//   categoryId: Number,
//   brandId: Number
// });

// const Product = mongoose.model('Product', productSchema);

// Product.find({
//   $or: [
//     { name: { $regex: searchTerm, $options: 'i' } },
//     { description: { $regex: searchTerm, $options: 'i' } }
//   ]
// }, (err, products) => {
//   if (err) {
//     result = err
//   } else {
//     result = products
//   }
// });


class SearchController {
    static index(req, res) {
      const searchTerm = req.params.search;
      const result = Products.filter(product => product.name.includes(searchTerm) || product.description.includes(searchTerm))
      res.json({
        success: true,
        message: result
      });
    }

    static article(req, res) {
      const id = Number(req.params.id);
      const result = Products.find(product => product.productId === id)
      res.json({
        success: true,
        product: result
      });
    }
  }
  
  module.exports = SearchController;