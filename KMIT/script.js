// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== HERO PARTICLES =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDelay = Math.random() * 8 + 's';
  p.style.animationDuration = (6 + Math.random() * 6) + 's';
  p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
  particlesContainer.appendChild(p);
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const stats = document.querySelectorAll('.hero-stat .num');
let counted = false;
function animateCounters() {
  if (counted) return;
  counted = true;
  stats.forEach(stat => {
    const text = stat.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      stat.innerHTML = current + suffix.replace(target.toString(), '');
      // Rebuild with span color
      const s = stat.textContent;
      const numPart = s.match(/(\d+)/)[0];
      const rest = s.replace(numPart, '');
      stat.innerHTML = numPart + '<span>' + rest + '</span>';
    }, 30);
  });
}
const heroStatsEl = document.querySelector('.hero-stats');
if (heroStatsEl) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStatsEl);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== FORM SUBMIT =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✅ Enquiry Submitted!';
    btn.style.background = 'linear-gradient(135deg, #00c9a7, #0a4d8c)';
    form.reset();
    setTimeout(() => { btn.innerHTML = originalHTML; btn.style.background = ''; }, 3000);
  });
}
