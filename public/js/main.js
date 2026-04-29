// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('active');
    });
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll('.payment-method');
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      document.getElementById('payment-method-input').value = method.dataset.method;
    });
  });

  // Quantity input handling on cart page
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const productId = input.dataset.id;
      const quantity = parseInt(e.target.value);
      if (window.cart) {
        await window.cart.updateQuantity(productId, quantity);
      }
    });
  });

  // Remove item buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = btn.dataset.id;
      if (window.cart && confirm('Remove this item?')) {
        await window.cart.removeItem(productId);
      }
    });
  });

  // Form validation
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const paymentMethod = document.getElementById('payment-method-input')?.value;
      
      if (!name || !email || !paymentMethod) {
        e.preventDefault();
        alert('Please fill in all required fields and select a payment method');
      }
    });
  }
});
