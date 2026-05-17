// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const announceBar = document.getElementById('announceBar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== HERO IMAGE SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const sliderDots = document.querySelectorAll('.slider-dot');
const progressFill = document.getElementById('sliderProgress');
let currentSlide = 0;
let slideInterval;
let progressAnimation;
const SLIDE_DURATION = 5000;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  sliderDots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  sliderDots[currentSlide].classList.add('active');
  resetProgress();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function resetProgress() {
  if (progressFill) {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressFill.style.width = '100%';
      });
    });
  }
}

function startAutoSlide() {
  stopAutoSlide();
  resetProgress();
  slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

document.getElementById('sliderNext')?.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
document.getElementById('sliderPrev')?.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

sliderDots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.slide));
    startAutoSlide();
  });
});

const heroEl = document.querySelector('.hero');
if (heroEl) {
  heroEl.addEventListener('mouseenter', stopAutoSlide);
  heroEl.addEventListener('mouseleave', startAutoSlide);
}

startAutoSlide();

// ===== HERO PARTICLES =====
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.animationDuration = (8 + Math.random() * 8) + 's';
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.opacity = (Math.random() * 0.4 + 0.1).toString();
    particlesContainer.appendChild(p);
  }
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  statNums.forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = (target >= 1000 ? Math.round(current).toLocaleString() : Math.round(current)) + suffix;
    }, duration / steps);
  });
}

const statsBar = document.querySelector('.hero-statsbar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.4 });
  statsObserver.observe(statsBar);
}

// ===== TESTIMONIALS CAROUSEL =====
const testiTrack = document.getElementById('testiTrack');
const tDots = document.querySelectorAll('.tdot');
let currentTesti = 0;
let testiInterval;
let isDragging = false;
let dragStartX = 0;
let dragStartTranslate = 0;

function getCardWidth() {
  const card = testiTrack?.querySelector('.testi-card');
  if (!card) return 404;
  return card.offsetWidth + 24;
}

function goToTesti(index) {
  const total = tDots.length;
  currentTesti = (index + total) % total;
  tDots.forEach(d => d.classList.remove('active'));
  tDots[currentTesti]?.classList.add('active');
  testiTrack.style.transform = `translateX(-${currentTesti * getCardWidth()}px)`;
}

function startTestiAuto() {
  stopTestiAuto();
  testiInterval = setInterval(() => goToTesti(currentTesti + 1), 4500);
}
function stopTestiAuto() { clearInterval(testiInterval); }

document.getElementById('tNext')?.addEventListener('click', () => { goToTesti(currentTesti + 1); startTestiAuto(); });
document.getElementById('tPrev')?.addEventListener('click', () => { goToTesti(currentTesti - 1); startTestiAuto(); });
tDots.forEach((dot, i) => dot.addEventListener('click', () => { goToTesti(i); startTestiAuto(); }));

if (testiTrack) {
  testiTrack.addEventListener('mouseenter', stopTestiAuto);
  testiTrack.addEventListener('mouseleave', startTestiAuto);

  // Touch / drag support
  testiTrack.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    const transform = getComputedStyle(testiTrack).transform;
    dragStartTranslate = transform === 'none' ? 0 : parseInt(new DOMMatrix(transform).m41);
    testiTrack.style.transition = 'none';
    stopTestiAuto();
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    testiTrack.style.transition = '';
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 60) {
      goToTesti(diff > 0 ? currentTesti - 1 : currentTesti + 1);
    } else {
      goToTesti(currentTesti);
    }
    startTestiAuto();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    testiTrack.style.transform = `translateX(${dragStartTranslate + diff}px)`;
  });

  let touchStartX = 0;
  testiTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopTestiAuto();
  }, { passive: true });
  testiTrack.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) goToTesti(diff > 0 ? currentTesti - 1 : currentTesti + 1);
    startTestiAuto();
  });
}

startTestiAuto();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✅ Enquiry Submitted Successfully!';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    btn.disabled = true;
    contactForm.reset();
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => scrollSpy.observe(s));
