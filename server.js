// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import routes
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const paymentRoutes = require('./routes/payment');
const marketingRoutes = require('./routes/marketing');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Make session cart available in views
app.use((req, res, next) => {
  res.locals.cart = req.session.cart || { items: [], totalItems: 0, totalPrice: 0 };
  next();
});

// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);
app.use('/payment', paymentRoutes);
app.use('/marketing', marketingRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Marketing dashboard: http://localhost:${PORT}/marketing/dashboard`);
});
