// routes/api.js
const express = require('express');
const router = express.Router();
const products = require('../data/products');
const Cart = require('../models/Cart');

// Get all products
router.get('/products', (req, res) => {
  res.json(products);
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  res.json(product);
});

// Add to cart
router.post('/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  let cart = req.session.cart ? new Cart(req.session.cart) : new Cart();
  cart.addItem(product, quantity || 1);
  req.session.cart = cart.toSession();
  
  res.json({ success: true, cart: req.session.cart });
});

// Update cart item
router.post('/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  let cart = new Cart(req.session.cart);
  cart.updateQuantity(parseInt(productId), parseInt(quantity));
  req.session.cart = cart.toSession();
  
  res.json({ success: true, cart: req.session.cart });
});

// Remove from cart
router.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  
  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  let cart = new Cart(req.session.cart);
  cart.removeItem(parseInt(productId));
  req.session.cart = cart.toSession();
  
  res.json({ success: true, cart: req.session.cart });
});

// Get cart
router.get('/cart', (req, res) => {
  res.json(req.session.cart || { items: [], totalItems: 0, totalPrice: 0 });
});

module.exports = router;
