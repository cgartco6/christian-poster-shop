// public/js/cart.js
class ShoppingCart {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadCart();
    this.bindEvents();
  }

  async loadCart() {
    try {
      const response = await fetch('/api/cart');
      const cart = await response.json();
      this.updateCartDisplay(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      const result = await response.json();
      if (result.success) {
        this.updateCartDisplay(result.cart);
        this.showNotification('Product added to cart!', 'success');
      }
      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Error adding to cart', 'error');
    }
  }

  async updateQuantity(productId, quantity) {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      const result = await response.json();
      if (result.success) {
        this.updateCartDisplay(result.cart);
        this.updateCartPage();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async removeItem(productId) {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const result = await response.json();
      if (result.success) {
        this.updateCartDisplay(result.cart);
        this.updateCartPage();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  updateCartDisplay(cart) {
    // Update cart count in navigation
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
      el.textContent = cart.totalItems || 0;
    });
    
    // Store cart in localStorage for quick access
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  updateCartPage() {
    // Reload cart page if we're on it
    if (window.location.pathname === '/cart') {
      window.location.reload();
    }
  }

  bindEvents() {
    // Bind add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.dataset.id);
        this.addToCart(productId, 1);
      });
    });
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
});
