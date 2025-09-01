document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('modeToggle');
  const shopBtn = document.querySelector('.hero-btn');
  const cartButtons = document.querySelectorAll('.add-to-cart');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
  }
  if (toggle) {
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }
  if (shopBtn) {
    shopBtn.addEventListener('click', () => {
      const featuredSection = document.getElementById('featured');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  if (cartButtons.length) {
    cartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const product = button.dataset.product;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!cart.includes(product)) {
          cart.push(product);
          localStorage.setItem('cart', JSON.stringify(cart));
          alert(`${product} added to cart!`);
        } else {
          alert(`${product} is already in your cart.`);
        }
      });
    });
  }
  console.log("Script loaded successfully");
});
