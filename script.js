/* ==========================================================================
   Freedom Health Ventures — Scripts
   ==========================================================================

   TABLE OF CONTENTS
   01. Config
   02. Page views (hash routing)
   03. Scroll-to-section links  [data-go]
   04. Clickable rows           [data-href]
   05. Announcement bar         [data-dismiss]
   06. Mobile menu
   07. Hide nav on scroll
   08. Forms (booking + newsletter)
   09. Init
   ========================================================================== */


/* ==========================================================================
   01. Config
   ========================================================================== */

// Pages that exist as <div class="view" id="view-...">
const VIEWS = ['home', 'wound-care', 'ai-agents', 'lifewave'];

// data-go value -> section to scroll to inside the active view
const SCROLL_TARGETS = {
  book: '.book',
  who: '#wound-who',
  features: '#ai-features',
  paths: '#life-paths',
};

// Section to scroll to after the next page change (set by data-go links)
let pendingScroll = null;


/* ==========================================================================
   02. Page views (hash routing)
   ========================================================================== */

// Show the view that matches the URL hash and update the nav + title.
function show() {
  let current = (location.hash || '#home').slice(1);
  if (!VIEWS.includes(current)) current = 'home';

  document.querySelectorAll('.view').forEach(view => {
    view.classList.toggle('active', view.id === 'view-' + current);
  });

  document.querySelectorAll('.nav a.link').forEach(link => {
    if (link.getAttribute('href') === '#' + current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.title = document.getElementById('view-' + current).dataset.title;
  closeMenu();
  return current;
}

window.addEventListener('hashchange', () => {
  show();
  if (pendingScroll) {
    scrollToTarget(pendingScroll);
    pendingScroll = null;
  } else {
    window.scrollTo(0, 0);
  }
});


/* ==========================================================================
   03. Scroll-to-section links  [data-go]
   ========================================================================== */

function scrollToTarget(target) {
  const view = document.querySelector('.view.active');
  if (!view) return;

  const el = view.querySelector(SCROLL_TARGETS[target] || '.book');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', e => {
  const link = e.target.closest('[data-go]');
  if (!link) return;

  // Pre-select the LifeWave path (Customer / Distributor) if the link sets one
  if (link.dataset.pick) {
    const select = document.getElementById('lifePath');
    if (select) select.value = link.dataset.pick;
  }

  const target = link.dataset.go;
  const href = link.getAttribute('href');

  // Link goes to another page: let the hash change, then scroll afterwards
  const changesPage = href && href !== location.hash && !(href === '#home' && !location.hash);
  if (changesPage) {
    pendingScroll = target;
    return;
  }

  // Already on the right page: just scroll
  e.preventDefault();
  scrollToTarget(target);
});


/* ==========================================================================
   04. Clickable rows  [data-href]
   ========================================================================== */

document.addEventListener('click', e => {
  const row = e.target.closest('[data-href]');
  if (row) location.hash = row.dataset.href;
});


/* ==========================================================================
   05. Announcement bar  [data-dismiss]
   ========================================================================== */

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-dismiss]');
  if (btn) btn.parentElement.remove();
});


/* ==========================================================================
   06. Mobile menu
   ========================================================================== */

function toggleMenu(btn) {
  const nav = document.getElementById('nav');
  const isOpen = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
  btn.textContent = isOpen ? 'Close' : 'Menu';
}

function closeMenu() {
  const nav = document.getElementById('nav');
  if (!nav.classList.contains('open')) return;

  nav.classList.remove('open');
  const btn = nav.querySelector('.menu-btn');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Menu';
}

document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => toggleMenu(btn));
});


/* ==========================================================================
   07. Hide nav on scroll
   ========================================================================== */

let lastY = 0;
const navShell = document.getElementById('navShell');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const menuOpen = document.getElementById('nav').classList.contains('open');
  const scrollingDown = y > lastY && y > 200;

  navShell.classList.toggle('hide', scrollingDown && !menuOpen);
  lastY = y;
}, { passive: true });


/* ==========================================================================
   08. Forms (booking + newsletter)
   Preview only: not connected to GoHighLevel yet.
   ========================================================================== */

// Booking / contact forms
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = form.querySelector('.ok');
    const pipeline = form.dataset.segment ? ' (' + form.dataset.segment + ' pipeline)' : '';

    ok.textContent = 'Preview only: this form isn’t connected yet. Once linked to GoHighLevel'
      + pipeline + ', submitting here will trigger the instant text reply.';
    ok.classList.add('show');
  });
});

// Newsletter signup
document.querySelectorAll('form[data-news]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = form.parentElement.querySelector('.ok');
    ok.textContent = 'Preview only: newsletter signup connects to GoHighLevel.';
    ok.classList.add('show');
  });
});


/* ==========================================================================
   09. Init
   ========================================================================== */

show();
