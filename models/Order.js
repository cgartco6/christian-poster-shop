// models/Order.js
const { v4: uuidv4 } = require('uuid');

class Order {
  constructor(cart, customerDetails, paymentMethod) {
    this.orderId = uuidv4().slice(0, 8).toUpperCase();
    this.items = cart.items;
    this.totalAmount = cart.totalPrice;
    this.customer = customerDetails;
    this.paymentMethod = paymentMethod;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  toJSON() {
    return {
      orderId: this.orderId,
      items: this.items,
      totalAmount: this.totalAmount,
      customer: this.customer,
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

// Simple in-memory order storage (replace with database in production)
const orders = [];

module.exports = { Order, orders };
