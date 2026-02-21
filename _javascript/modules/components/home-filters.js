export function initHomeFilters() {
  const grid = document.getElementById('post-grid');
  const categorySelect = document.getElementById('filter-category');
  const tagContainer = document.getElementById('filter-tags');
  const sortSelect = document.getElementById('filter-sort');
  const clearBtn = document.getElementById('filter-clear');

  if (!grid || !categorySelect || !tagContainer || !sortSelect) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll('.post-card'));
  const selectedTags = new Set();

  cards.forEach((card, index) => {
    card.dataset.order = String(index);
  });

  function parseTags(card) {
    const raw = card.dataset.tags || '';
    return raw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function matchesTags(card) {
    if (selectedTags.size === 0) {
      return true;
    }

    const cardTags = parseTags(card);
    return [...selectedTags].every((tag) => cardTags.includes(tag));
  }

  function matchesCategory(card) {
    const current = categorySelect.value;
    if (!current) {
      return true;
    }
    return card.dataset.category === current;
  }

  function sortCards(list) {
    const mode = sortSelect.value;

    if (mode === 'popular') {
      return list.sort((a, b) => {
        const aViews = Number(a.dataset.views || 0);
        const bViews = Number(b.dataset.views || 0);
        if (bViews !== aViews) {
          return bViews - aViews;
        }
        return Number(b.dataset.date) - Number(a.dataset.date);
      });
    }

    return list.sort((a, b) => Number(b.dataset.date) - Number(a.dataset.date));
  }

  function applyFilters() {
    const visible = cards.filter((card) => matchesTags(card) && matchesCategory(card));
    const sorted = sortCards(visible);

    cards.forEach((card) => card.classList.add('is-hidden'));
    sorted.forEach((card) => {
      card.classList.remove('is-hidden');
      grid.appendChild(card);
    });
  }

  tagContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-tag]');
    if (!target) {
      return;
    }

    const tag = target.dataset.tag;
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
      target.classList.remove('is-active');
      document.dispatchEvent(new CustomEvent('filter:tag', { detail: { tag, active: false } }));
    } else {
      selectedTags.add(tag);
      target.classList.add('is-active');
      document.dispatchEvent(new CustomEvent('filter:tag', { detail: { tag, active: true } }));
    }

    applyFilters();
  });

  categorySelect.addEventListener('change', () => {
    document.dispatchEvent(
      new CustomEvent('filter:category', { detail: { category: categorySelect.value } })
    );
    applyFilters();
  });

  sortSelect.addEventListener('change', () => {
    applyFilters();
  });

  clearBtn?.addEventListener('click', () => {
    selectedTags.clear();
    tagContainer.querySelectorAll('[data-tag]').forEach((btn) => btn.classList.remove('is-active'));
    categorySelect.value = '';
    sortSelect.value = 'latest';
    applyFilters();
  });

  applyFilters();
}
