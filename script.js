const modeToggle = document.getElementById("modeToggle");
const body = document.body;
if (localStorage.getItem("mode") === "dark") {
  body.classList.add("dark");
  if (modeToggle) modeToggle.textContent = "☀️"; // Light mode icon
} else {
  if (modeToggle) modeToggle.textContent = "🌙"; // Dark mode icon
}

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
      modeToggle.textContent = "☀️"; // Switch to light
    } else {
      localStorage.setItem("mode", "light");
      modeToggle.textContent = "🌙"; // Switch to dark
    }
  });
}

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  const existingLink = document.querySelector('link[href*="font-awesome"]');
  if (!existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(link);
  }

  const wrapper = document.getElementById("projectsWrapper");
  const btn = document.getElementById("toggleBtn");
  if (wrapper && btn) {
    btn.textContent = (wrapper.style.display === "block") ? "Hide Projects" : "View Projects";
  }
});

function toggleProjects() {
  const wrapper = document.getElementById("projectsWrapper");
  const btn = document.getElementById("toggleBtn");

  if (wrapper && btn) {
    if (wrapper.style.display === "none" || wrapper.style.display === "") {
      wrapper.style.display = "block";
      btn.textContent = "Hide Projects";
    } else {
      wrapper.style.display = "none";
      btn.textContent = "View Projects";
    }
  }
}
