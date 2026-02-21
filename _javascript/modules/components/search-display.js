/**
 * Search overlay display and input handling.
 */

const btnNavTrigger = document.getElementById('nav-trigger');
const btnSearchTrigger = document.getElementById('search-trigger');
const btnCancel = document.getElementById('search-cancel');
const searchPill = document.querySelector('.search-pill');
const resultWrapper = document.getElementById('search-result-wrapper');
const results = document.getElementById('search-results');
const input = document.getElementById('search-input');
const hints = document.getElementById('search-hints');

function openSearch() {
  document.body.classList.add('search-open');
  resultWrapper?.classList.remove('d-none');
  btnCancel?.classList.add('show');
  btnNavTrigger?.classList.add('d-none');
  searchPill?.classList.add('is-active');
  input?.focus();
}

function closeSearch() {
  document.body.classList.remove('search-open');
  resultWrapper?.classList.add('d-none');
  btnCancel?.classList.remove('show');
  btnNavTrigger?.classList.remove('d-none');
  searchPill?.classList.remove('is-active');

  if (results) {
    results.innerHTML = '';
  }

  if (hints) {
    hints.classList.remove('d-none');
  }

  if (input) {
    input.value = '';
  }
}

export function displaySearch() {
  if (!btnSearchTrigger || !input) {
    return;
  }

  btnSearchTrigger.addEventListener('click', openSearch);
  searchPill?.addEventListener('click', openSearch);
  input.addEventListener('focus', openSearch);
  btnCancel?.addEventListener('click', closeSearch);

  input.addEventListener('input', () => {
    if (!hints) {
      return;
    }

    if (input.value === '') {
      hints.classList.remove('d-none');
      if (!document.body.classList.contains('search-open')) {
        closeSearch();
      }
    } else {
      if (!document.body.classList.contains('search-open')) {
        openSearch();
      }
      hints.classList.add('d-none');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      openSearch();
    }

    if (e.key === 'Escape') {
      closeSearch();
    }
  });
}
