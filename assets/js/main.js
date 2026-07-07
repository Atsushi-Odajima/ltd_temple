/* ==========================================================================
   Freedom.inc — shared scripts
   ========================================================================== */
(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('globalNav');
  const toggle = document.getElementById('navToggle');

  /* Header state on scroll */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Highlight current nav item */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.global-nav ul a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && path.startsWith(href.split('#')[0])) a.classList.add('is-current');
  });

  /* Scroll reveal */
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-shown');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('is-shown'));
  }

  /* Footer year */
  const year = document.getElementById('copyYear');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Contact form (demo): validate consent + show completion message */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      form.hidden = true;
      const done = document.getElementById('formDone');
      if (done) {
        done.hidden = false;
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
})();
