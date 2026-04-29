const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const orderId = event.data.object.metadata.orderId;
    await Order.findOneAndUpdate({ orderId }, { status: 'paid' });
  }
  res.json({ received: true });
});

// PayFast ITN (simplified)
router.post('/payfast', express.urlencoded({ extended: true }), async (req, res) => {
  const { m_payment_id, payment_status } = req.body;
  if (payment_status === 'COMPLETED') {
    await Order.findOneAndUpdate({ orderId: m_payment_id }, { status: 'paid' });
  }
  res.send('OK');
});

module.exports = router;
