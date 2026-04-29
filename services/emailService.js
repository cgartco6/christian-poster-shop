const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrderConfirmation(order, userEmail) {
  const html = `
    <h1>Thank you for your order, ${order.customer.name}!</h1>
    <p>Order #${order.orderId}</p>
    <p>Total: R${order.totalAmount}</p>
    <p>We'll notify you when your posters ship.</p>
  `;
  const msg = { to: userEmail, from: process.env.EMAIL_FROM, subject: `Order Confirmation #${order.orderId}`, html };
  await sgMail.send(msg);
}

async function sendPasswordReset(email, token) { /* implement */ }

module.exports = { sendOrderConfirmation };
