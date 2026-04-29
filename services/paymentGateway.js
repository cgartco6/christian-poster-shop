// services/paymentGateway.js

// For direct EFT (no API) – simply return FNB banking details
function getFnbEftDetails(orderId, totalAmount) {
  return {
    bank: "FNB (First National Bank)",
    accountName: "Christian Poster Shop CC",
    accountNumber: "62847900234",
    branchCode: "250655",
    swiftCode: "FIRNZAJJ",
    reference: `POSTER-${orderId}`,
    amount: totalAmount,
    instructions: `Please use your order ID (${orderId}) as reference. Payment may take 1-2 business days to reflect.`
  };
}

// For PayFast – generate form data (mock)
function getPayFastForm(order, merchantId, merchantKey, returnUrl, cancelUrl, notifyUrl) {
  return {
    method: "POST",
    action: process.env.PAYFAST_SANDBOX === "true" 
      ? "https://sandbox.payfast.co.za/eng/process" 
      : "https://www.payfast.co.za/eng/process",
    fields: {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      amount: order.totalAmount.toFixed(2),
      item_name: `Christian Posters - Order ${order.orderId}`,
      m_payment_id: order.orderId,
      email_confirmation: "1",
      confirmation_address: order.customer.email
    }
  };
}

// For Stripe – create Checkout session (stub – actual Stripe SDK is used in route)
function prepareStripeSession(order) {
  return {
    line_items: order.items.map(item => ({
      price_data: {
        currency: "zar",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    })),
    mode: "payment",
    success_url: `/payment/stripe/success?order=${order.orderId}`,
    cancel_url: "/payment/cancel"
  };
}

// For PayPal – create payment JSON (stub)
function preparePayPalPayment(order, returnUrl, cancelUrl) {
  return {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: { return_url: returnUrl, cancel_url: cancelUrl },
    transactions: [{
      amount: { currency: "ZAR", total: order.totalAmount.toFixed(2) },
      description: `Order ${order.orderId} - Christian Posters`
    }]
  };
}

module.exports = {
  getFnbEftDetails,
  getPayFastForm,
  prepareStripeSession,
  preparePayPalPayment
};
