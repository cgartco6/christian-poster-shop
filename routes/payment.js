router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === 'checkout.session.completed') {
    const orderId = event.data.object.metadata.orderId;
    await Order.findOneAndUpdate({ orderId }, { status: 'paid' });
  }
  res.json({ received: true });
});
