const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  verse: String,
  price: { type: Number, required: true, default: 50 },
  stock: { type: Number, default: 999 },
  imageUrl: String,
  category: String
});

module.exports = mongoose.model('Product', productSchema);
