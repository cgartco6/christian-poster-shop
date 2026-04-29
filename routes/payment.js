// routes/payment.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const { Order, orders } = require('../models/Order');
const Cart = require('../models/Cart');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Process order and redirect to payment
router.post('/process', (req, res) => {
  const { name, email, phone, address, paymentMethod } = req.body;
  const cart = req.session.cart;
  
  if (!cart || cart.totalItems === 0) {
    return res.redirect('/cart');
  }
  
  const customerDetails = { name, email, phone, address };
  const order = new Order(cart, customerDetails, paymentMethod);
  orders.push(order.toJSON());
  
  // Store order in session for payment completion
  req.session.currentOrder = order;
  
  switch (paymentMethod) {
    case 'payfast':
      res.redirect(`/payment/payfast/${order.orderId}`);
      break;
    case 'stripe':
      res.redirect(`/payment/stripe/${order.orderId}`);
      break;
    case 'paypal':
      res.redirect(`/payment/paypal/${order.orderId}`);
      break;
    case 'eft':
      res.redirect(`/payment/eft/${order.orderId}`);
      break;
    default:
      res.redirect('/checkout?error=Invalid payment method');
  }
});

// PayFast Integration
router.get('/payfast/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).send('Order not found');
  
  res.render('payment/payfast-form', {
    title: 'PayFast Payment',
    order,
    merchantId: process.env.PAYFAST_MERCHANT_ID,
    sandbox: process.env.PAYFAST_SANDBOX === 'true'
  });
});

// PayFast success/cancel/notify
router.post('/payfast/notify', (req, res) => {
  console.log('PayFast IPN received:', req.body);
  // Verify payment and update order status
  res.send('OK');
});

router.get('/payfast/success', (req, res) => {
  req.session.cart = null;
  res.redirect('/payment/success?order=' + req.query.order_id);
});

router.get('/payfast/cancel', (req, res) => {
  res.redirect('/payment/cancel');
});

// Stripe Integration
router.get('/stripe/:orderId', async (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).send('Order not found');
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'zar',
          product_data: {
            name: item.name
          },
          unit_amount: item.price * 100 // Convert to cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}&order=${order.orderId}`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`
    });
    
    res.redirect(session.url);
  } catch (error) {
    console.error('Stripe error:', error);
    res.redirect('/payment/cancel');
  }
});

router.get('/stripe/success', (req, res) => {
  req.session.cart = null;
  res.redirect(`/payment/success?order=${req.query.order}`);
});

// PayPal Integration
router.get('/paypal/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).send('Order not found');
  
  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: `${req.protocol}://${req.get('host')}/payment/paypal/success?order=${order.orderId}`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`
    },
    transactions: [{
      amount: {
        currency: 'ZAR',
        total: order.totalAmount.toFixed(2)
      },
      description: `Order ${order.orderId} - Christian Posters`
    }]
  };
  
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error('PayPal error:', error);
      return res.redirect('/payment/cancel');
    }
    
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
    res.redirect(approvalUrl);
  });
});

router.get('/paypal/success', (req, res) => {
  const { paymentId, PayerID, order } = req.query;
  
  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [{ amount: { currency: 'ZAR', total: '0.00' } }]
  };
  
  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error('PayPal execute error:', error);
      return res.redirect('/payment/cancel');
    }
    
    req.session.cart = null;
    res.redirect(`/payment/success?order=${order}`);
  });
});

// Direct EFT
router.get('/eft/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).send('Order not found');
  
  res.render('payment/eft-details', {
    title: 'Direct EFT Payment',
    order,
    bankDetails: {
      bank: 'Capitec Bank',
      accountName: 'Christian Poster Shop',
      accountNumber: '1234567890',
      branchCode: '470010',
      reference: order.orderId,
      swift: 'CABLZAJJ'
    }
  });
});

// Success and cancel pages
router.get('/success', (req, res) => {
  const orderId = req.query.order;
  const order = orders.find(o => o.orderId === orderId);
  res.render('payment-success', { title: 'Payment Successful', order });
});

router.get('/cancel', (req, res) => {
  res.render('payment-cancel', { title: 'Payment Cancelled' });
});

module.exports = router;
