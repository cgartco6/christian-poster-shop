// routes/web.js
const express = require('express');
const router = express.Router();
const products = require('../data/products');
const Cart = require('../models/Cart');

// Home page
router.get('/', (req, res) => {
  const featuredProducts = products.slice(0, 8);
  res.render('index', { title: 'Christian Poster Shop', featuredProducts });
});

// Products page
router.get('/products', (req, res) => {
  res.render('products', { title: 'All Posters', products });
});

// Product details (AJAX/API used for add to cart)
router.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('product-detail', { title: product.name, product });
});

// Cart page
router.get('/cart', (req, res) => {
  res.render('cart', { title: 'Shopping Cart' });
});

// Checkout page
router.get('/checkout', (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.totalItems === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout', { title: 'Checkout', cart });
});

module.exports = router;
