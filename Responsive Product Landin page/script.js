const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
  });
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    const offset = 72;
    const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: topPos, behavior: 'smooth' });
    if (navLinks && navLinks.classList.contains('mobile-active') && window.innerWidth < 768) {
      navLinks.classList.remove('mobile-active');
    }
  });
});
const scrollBtn = document.getElementById('scrollToTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 350 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[name="email"]') || document.getElementById('email');
    const emailValue = emailInput ? emailInput.value.trim() : '';
    if (!emailValue) {
      alert('Please enter an email.');
      return;
    }
    alert(`Thanks — ${emailValue} subscribed! (demo)`);
    newsletterForm.reset();
  });
}
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-image');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;

function updateCarousel() {
  if (!carouselImages.length) return;
  const width = carouselImages[0].clientWidth;
  carouselSlide.style.transform = `translateX(-${currentIndex * width}px)`;

  carouselImages.forEach((img, idx) => {
    img.classList.toggle('active', idx === currentIndex);
  });
}

if (prevBtn && nextBtn && carouselImages.length) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    updateCarousel();
  });
  setInterval(() => {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    updateCarousel();
  }, 5000);

  updateCarousel();
}
const cart = [];

document.querySelectorAll('.buy-now-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const productData = this.dataset.product;
    if (!productData) return;

    const [name, price] = productData.split('|');
    if (!name || !price) return;

    cart.push({ name, price: parseFloat(price) });

    alert(`Added to cart: ${name} ($${price})\nTotal items in cart: ${cart.length}`);
  });
});
