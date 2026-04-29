const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  verse: String,
  price: Number,
  stock: { type: Number, default: 999 },
  imageUrl: String,
  category: String
});

module.exports = mongoose.model('Product', productSchema);
