/* ===================================
   TINKY — APP JS
   =================================== */

/* =====================================================
   CURSOR GLOW TRAIL
   ===================================================== */
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* =====================================================
   PARTICLE CANVAS
   ===================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['rgba(94,139,255,', 'rgba(111,231,255,', 'rgba(140,125,255,'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.opacityDelta = (Math.random() * 0.01) * (Math.random() > 0.5 ? 1 : -1);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = Math.random() * 300 + 100;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.opacityDelta;
    this.life++;
    if (this.opacity <= 0 || this.opacity >= 0.7) this.opacityDelta *= -1;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connecting lines for nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(94,139,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =====================================================
   MASCOT PARTICLES
   ===================================================== */
function createMascotParticle() {
  const container = document.getElementById('mascot-particles');
  if (!container) return;

  const particle = document.createElement('div');
  const angle = Math.random() * Math.PI * 2;
  const radius = 80 + Math.random() * 40;
  const startX = Math.cos(angle) * radius + 110;
  const startY = Math.sin(angle) * radius + 110;

  particle.style.cssText = `
    position: absolute;
    left: ${startX}px;
    top: ${startY}px;
    width: ${Math.random() * 5 + 2}px;
    height: ${Math.random() * 5 + 2}px;
    border-radius: 50%;
    background: ${Math.random() > 0.5 ? '#5E8BFF' : '#6FE7FF'};
    pointer-events: none;
    opacity: ${Math.random() * 0.6 + 0.4};
    box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
    animation: particleFly ${Math.random() * 1500 + 1000}ms ease-out forwards;
    transform-origin: center;
  `;

  container.appendChild(particle);
  setTimeout(() => { if (particle.parentNode) particle.remove(); }, 2500);
}

// Add particle fly animation
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFly {
    0% { opacity: 1; transform: scale(1) translate(0, 0); }
    100% { opacity: 0; transform: scale(0) translate(${(Math.random()-0.5)*60}px, ${-30-Math.random()*60}px); }
  }
`;
document.head.appendChild(style);

setInterval(createMascotParticle, 600);

/* =====================================================
   NAVBAR SCROLL EFFECT
   ===================================================== */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
});

/* =====================================================
   MOBILE MENU
   ===================================================== */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* =====================================================
   HERO DEMO ANIMATION
   ===================================================== */
function runDemoAnimation() {
  const selectedText = document.getElementById('demo-selected-text');
  const shortcutBadge = document.getElementById('demo-shortcut');
  const popup = document.getElementById('demo-popup');
  const result = document.getElementById('demo-result');

  if (!selectedText || !shortcutBadge || !popup || !result) return;

  // Reset
  selectedText.classList.remove('active');
  shortcutBadge.classList.remove('visible');
  popup.classList.remove('visible');
  result.classList.remove('visible');

  const timeline = [
    { delay: 800, action: () => selectedText.classList.add('active') },
    { delay: 1600, action: () => shortcutBadge.classList.add('visible') },
    { delay: 2400, action: () => { shortcutBadge.classList.remove('visible'); popup.classList.add('visible'); } },
    { delay: 3600, action: () => { popup.classList.remove('visible'); result.classList.add('visible'); } },
    { delay: 5500, action: () => {
      // Reset for next loop
      result.classList.remove('visible');
      selectedText.classList.remove('active');
    }},
    { delay: 7000, action: () => runDemoAnimation() }
  ];

  timeline.forEach(({ delay, action }) => setTimeout(action, delay));
}

// Start demo when it comes into view
const demoSection = document.getElementById('hero-demo');
let demoStarted = false;
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !demoStarted) {
      demoStarted = true;
      setTimeout(runDemoAnimation, 1000);
    }
  });
}, { threshold: 0.3 });

if (demoSection) demoObserver.observe(demoSection);

/* =====================================================
   PARALLAX EFFECT
   ===================================================== */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroOrbs = document.querySelectorAll('.hero-orb');
  heroOrbs.forEach((orb, i) => {
    const speed = 0.15 + i * 0.08;
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });

  // Mascot parallax
  const mascot = document.getElementById('hero-mascot');
  if (mascot && scrolled < window.innerHeight) {
    mascot.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

/* =====================================================
   FEATURE CARDS GLOW INTERACTION
   ===================================================== */
document.querySelectorAll('.feature-card, .usecase-card-inner, .promise-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');

    // Dynamic glow
    const glowEl = card.querySelector('.feature-card-glow');
    if (glowEl) {
      glowEl.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(94,139,255,0.12), transparent 60%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    const glowEl = card.querySelector('.feature-card-glow');
    if (glowEl) {
      glowEl.style.background = '';
    }
  });
});

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const initial = 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(initial + (target - initial) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + suffix;
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      const data = [
        { value: 2400, suffix: '+' },
        { value: 140000, suffix: '+' },
        { value: 98, suffix: '%' }
      ];

      statNumbers.forEach((el, i) => {
        if (data[i]) {
          setTimeout(() => animateCounter(el, data[i].value, 1800, data[i].suffix), i * 200);
        }
      });

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const betaStats = document.querySelector('.beta-stats');
if (betaStats) statsObserver.observe(betaStats);

/* =====================================================
   SMOOTH SCROLL FOR NAV LINKS
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =====================================================
   CURSOR INTERACTION ON BUTTONS
   ===================================================== */
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorGlow) cursorGlow.style.width = '200px';
    if (cursorGlow) cursorGlow.style.height = '200px';
  });
  el.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.style.width = '300px';
    if (cursorGlow) cursorGlow.style.height = '300px';
  });
});

/* =====================================================
   INITIAL REVEAL FOR HERO (above fold)
   ===================================================== */
setTimeout(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('revealed');
  });
}, 100);

/* =====================================================
   BREATHING GLOW EFFECT ON HERO MASCOT
   ===================================================== */
const mascotImg = document.getElementById('mascot-img');
if (mascotImg) {
  let glowIntensity = 0;
  let glowDir = 1;

  function breatheGlow() {
    glowIntensity += 0.008 * glowDir;
    if (glowIntensity >= 1) glowDir = -1;
    if (glowIntensity <= 0) glowDir = 1;

    const blue = `rgba(94,139,255,${0.3 + glowIntensity * 0.3})`;
    const cyan = `rgba(111,231,255,${0.1 + glowIntensity * 0.2})`;
    mascotImg.style.filter = `drop-shadow(0 0 30px ${blue}) drop-shadow(0 0 60px ${cyan})`;
    requestAnimationFrame(breatheGlow);
  }
  breatheGlow();
}

/* =====================================================
   PAGE LOAD INTRO ANIMATION
   ===================================================== */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.6s ease';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.documentElement.style.opacity = '1';
  }, 100);
});

console.log('✨ Tinky is ready. Your genie awaits.');
