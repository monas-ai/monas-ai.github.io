const drawer = document.getElementById('mobile-drawer');
const backdrop = document.getElementById('nav-backdrop');
const trigger = document.getElementById('nav-trigger');
const closeBtn = document.getElementById('nav-close');

function openNav() {
  if (!drawer) {
    return;
  }
  document.body.classList.add('nav-open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeNav() {
  if (!drawer) {
    return;
  }
  document.body.classList.remove('nav-open');
  drawer.setAttribute('aria-hidden', 'true');
}

export function initNav() {
  if (!drawer || !trigger) {
    return;
  }

  trigger.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  backdrop?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
}
