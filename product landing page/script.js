function toggleMenu() {
  document.getElementById('navbar').classList.toggle('active');
}
window.onscroll = () => {
  const btn = document.getElementById('backToTop');
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
};
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Item added to cart!');
    });
  });

  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for signing up!');
      signupForm.reset();
    });
  }
});
function filterModels(style) {
  const cards = document.querySelectorAll('.variant-card');
  const buttons = document.querySelectorAll('.style-filters button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(`'${style}'`)) {
      btn.classList.add('active');
    }
  });
  cards.forEach(card => {
    const matches = style === 'all' || card.dataset.style === style;
    card.style.display = matches ? 'block' : 'none';
  });
}
