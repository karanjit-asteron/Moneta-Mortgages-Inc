/* =============================================
   MONETA MORTGAGES — main.js
   Handles: Header/footer loading, nav states,
            mobile menu, scroll effects, animations
============================================= */

// ── Component Loader ──────────────────────────
async function loadComponents() {
  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');

  try {
    if (headerEl) {
      const res = await fetch('header.html');
      if (res.ok) {
        headerEl.innerHTML = await res.text();
        initHeader();
        setActiveNav();
      }
    }
    if (footerEl) {
      const res = await fetch('footer.html');
      if (res.ok) {
        footerEl.innerHTML = await res.text();
      }
    }
  } catch (err) {
    console.warn('Component load error:', err);
  }
}

// ── Header Interactivity ──────────────────────
function initHeader() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      // Animate hamburger
      const spans = toggle.querySelectorAll('span');
      toggle.classList.toggle('active');
      if (toggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('active');
        const spans = toggle.querySelectorAll('span');
        spans.forEach(s => s.style.transform = s.style.opacity = '');
      }
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
  }, { passive: true });
}

// ── Active Navigation ─────────────────────────
function setActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === currentFile) {
      link.classList.add('active');
    }
  });

  // Also mark sidebar service links
  document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    if (link.dataset.page === currentFile) {
      link.classList.add('current');
    }
  });
}

// ── Scroll Reveal Animations ──────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger within the same batch
          const delay = parseFloat(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el, idx) => {
    // Auto-assign delay for sibling elements in same parent
    if (!el.dataset.delay) {
      const siblings = [...el.parentElement.querySelectorAll('.scroll-reveal')];
      const pos = siblings.indexOf(el);
      el.dataset.delay = (pos * 0.1).toFixed(1);
    }
    observer.observe(el);
  });
}

// ── Smooth number counter for stats ──────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;
    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadComponents().then(() => {
    initScrollReveal();
    initCounters();
  });
});
