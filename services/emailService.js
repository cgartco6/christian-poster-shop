const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrderConfirmation(order, userEmail) {
  const msg = {
    to: userEmail,
    from: process.env.EMAIL_FROM,
    subject: `Order Confirmation #${order.orderId}`,
    html: `<h1>Thank you for your purchase!</h1><p>Order total: R${order.totalAmount}</p>...`
  };
  await sgMail.send(msg);
}

module.exports = { sendOrderConfirmation };
