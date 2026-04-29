// models/Cart.js
class Cart {
  constructor(sessionCart = null) {
    this.items = sessionCart?.items || [];
    this.totalItems = sessionCart?.totalItems || 0;
    this.totalPrice = sessionCart?.totalPrice || 0;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    this.updateTotals();
    return this;
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.updateTotals();
      }
    }
    return this;
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateTotals();
    return this;
  }

  updateTotals() {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clear() {
    this.items = [];
    this.totalItems = 0;
    this.totalPrice = 0;
    return this;
  }

  toSession() {
    return {
      items: this.items,
      totalItems: this.totalItems,
      totalPrice: this.totalPrice
    };
  }
}

module.exports = Cart;
