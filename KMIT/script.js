/* =============================================
   KMIT — Premium Website Script
   ============================================= */

// ===== PRELOADER =====
(function () {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => preloader.classList.add('done'), 350);
    }
    if (fill) fill.style.width = progress + '%';
    if (pct) pct.textContent = Math.round(progress) + '%';
  }, 80);

  window.addEventListener('load', () => {
    progress = 100;
    if (fill) fill.style.width = '100%';
    if (pct) pct.textContent = '100%';
    clearInterval(interval);
    setTimeout(() => preloader.classList.add('done'), 500);
  });
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  navbar.classList.toggle('scrolled', sy > 60);
  lastScrollY = sy;
  toggleFloatTop(sy);
  toggleStickyAdmit(sy);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  navToggle.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== HERO IMAGE SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const sliderDots = document.querySelectorAll('.slider-dot');
const progressFill = document.getElementById('sliderProgress');
let currentSlide = 0;
let slideTimer;
const SLIDE_MS = 5500;

function activateSlide(index) {
  slides[currentSlide]?.classList.remove('active');
  sliderDots[currentSlide]?.classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide]?.classList.add('active');
  sliderDots[currentSlide]?.classList.add('active');
  restartProgress();
}

function restartProgress() {
  if (!progressFill) return;
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    progressFill.style.transition = `width ${SLIDE_MS}ms linear`;
    progressFill.style.width = '100%';
  }));
}

function startSlider() {
  stopSlider();
  restartProgress();
  slideTimer = setInterval(() => activateSlide(currentSlide + 1), SLIDE_MS);
}
function stopSlider() { clearInterval(slideTimer); }

document.getElementById('sliderNext')?.addEventListener('click', () => { activateSlide(currentSlide + 1); startSlider(); });
document.getElementById('sliderPrev')?.addEventListener('click', () => { activateSlide(currentSlide - 1); startSlider(); });
sliderDots.forEach(d => d.addEventListener('click', () => { activateSlide(+d.dataset.slide); startSlider(); }));

const heroSection = document.querySelector('.hero');
heroSection?.addEventListener('mouseenter', stopSlider);
heroSection?.addEventListener('mouseleave', startSlider);

// Touch swipe on hero
let heroTouchX = 0;
heroSection?.addEventListener('touchstart', e => { heroTouchX = e.touches[0].clientX; }, { passive: true });
heroSection?.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - heroTouchX;
  if (Math.abs(diff) > 50) { activateSlide(diff > 0 ? currentSlide - 1 : currentSlide + 1); startSlider(); }
});

startSlider();

// ===== HERO PARTICLES =====
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      animation-delay: ${Math.random() * 10}s;
      animation-duration: ${8 + Math.random() * 8}s;
      background: ${Math.random() > 0.5 ? 'var(--cyan)' : 'var(--blue-400)'};
    `;
    particlesEl.appendChild(p);
  }
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 75);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num[data-target]');
let countersRan = false;

function runCounters() {
  if (countersRan) return;
  countersRan = true;
  statNums.forEach(el => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix ?? '';
    const dur = 1800;
    const steps = 60;
    let cur = 0;
    const inc = target / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      el.textContent = (target >= 1000
        ? Math.round(cur).toLocaleString('en-IN')
        : Math.round(cur)) + suffix;
      if (cur >= target) clearInterval(t);
    }, dur / steps);
  });
}

const statsBar = document.querySelector('.hero-statsbar');
if (statsBar) {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { runCounters(); } }, { threshold: 0.3 })
    .observe(statsBar);
}

// ===== TESTIMONIALS CAROUSEL =====
const testiTrack = document.getElementById('testiTrack');
const tDots = document.querySelectorAll('.tdot');
let curTesti = 0;
let testiTimer;
let tDragging = false;
let tDragStartX = 0;

function cardW() {
  const c = testiTrack?.querySelector('.testi-card');
  return c ? c.offsetWidth + 24 : 404;
}

function moveTo(idx) {
  const total = tDots.length;
  curTesti = ((idx % total) + total) % total;
  tDots.forEach((d, i) => d.classList.toggle('active', i === curTesti));
  testiTrack.style.transform = `translateX(-${curTesti * cardW()}px)`;
}

function startTesti() {
  clearInterval(testiTimer);
  testiTimer = setInterval(() => moveTo(curTesti + 1), 4500);
}
function stopTesti() { clearInterval(testiTimer); }

document.getElementById('tNext')?.addEventListener('click', () => { moveTo(curTesti + 1); startTesti(); });
document.getElementById('tPrev')?.addEventListener('click', () => { moveTo(curTesti - 1); startTesti(); });
tDots.forEach((d, i) => d.addEventListener('click', () => { moveTo(i); startTesti(); }));

testiTrack?.addEventListener('mouseenter', stopTesti);
testiTrack?.addEventListener('mouseleave', startTesti);

// Drag to swipe testimonials
testiTrack?.addEventListener('mousedown', e => {
  tDragging = true; tDragStartX = e.clientX;
  testiTrack.style.transition = 'none';
  stopTesti();
});
window.addEventListener('mouseup', e => {
  if (!tDragging) return;
  tDragging = false;
  testiTrack.style.transition = '';
  moveTo(e.clientX - tDragStartX < -60 ? curTesti + 1 : e.clientX - tDragStartX > 60 ? curTesti - 1 : curTesti);
  startTesti();
});
window.addEventListener('mousemove', e => {
  if (!tDragging) return;
  const cur = new DOMMatrix(getComputedStyle(testiTrack).transform).m41;
  testiTrack.style.transform = `translateX(${cur + e.movementX}px)`;
});

// Touch
let tTouchX = 0;
testiTrack?.addEventListener('touchstart', e => { tTouchX = e.touches[0].clientX; stopTesti(); }, { passive: true });
testiTrack?.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - tTouchX;
  if (Math.abs(d) > 50) moveTo(d > 0 ? curTesti - 1 : curTesti + 1);
  startTesti();
});

startTesti();

// ===== GALLERY LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbCaption = document.getElementById('lightboxCaption');
const lbClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.style.cursor = 'zoom-in';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-hover span')?.textContent || '';
    if (lbImg && img) { lbImg.src = img.src; lbImg.alt = img.alt; }
    if (lbCaption) lbCaption.textContent = caption;
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== BACK TO TOP =====
const floatTop = document.getElementById('floatTop');
function toggleFloatTop(sy) {
  floatTop?.classList.toggle('visible', sy > 400);
}
floatTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== STICKY ADMISSION BAR =====
const stickyAdmit = document.getElementById('stickyAdmit');
const stickyClose = document.getElementById('stickyClose');
let stickyDismissed = false;
const STICKY_THRESHOLD = window.innerHeight * 0.9;

function toggleStickyAdmit(sy) {
  if (stickyDismissed) return;
  stickyAdmit?.classList.toggle('show', sy > STICKY_THRESHOLD);
}
stickyClose?.addEventListener('click', () => {
  stickyDismissed = true;
  stickyAdmit?.classList.remove('show');
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar?.offsetHeight + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ===== NAV ACTIVE LINK HIGHLIGHT ON SCROLL =====
const scrollSections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const spyObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navAnchors.forEach(a => {
        const active = a.getAttribute('href') === id;
        a.style.color = active ? 'var(--white)' : '';
        a.style.fontWeight = active ? '700' : '';
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-50px 0px -50px 0px' });
scrollSections.forEach(s => spyObs.observe(s));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;

  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();

    if (json.success) {
      btn.innerHTML = '✅ Enquiry Submitted Successfully!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      contactForm.reset();
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 5000);
    } else {
      throw new Error(json.message || 'Submission failed');
    }
  } catch (err) {
    btn.innerHTML = '❌ Failed. Please try again.';
    btn.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
    btn.disabled = false;
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 4000);
  }
});

// ===== PREVENT ANNOUNCE BAR TOP OFFSET on mobile =====
function adjustNavTop() {
  const ab = document.querySelector('.announce-bar');
  const abH = ab ? ab.offsetHeight : 0;
  if (navbar) navbar.style.top = abH > 0 ? abH + 'px' : '0px';
}
adjustNavTop();
window.addEventListener('resize', adjustNavTop);
