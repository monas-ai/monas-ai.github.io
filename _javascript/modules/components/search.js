export function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const hints = document.getElementById('search-hints');

  if (!input || !results) {
    return;
  }

  let index = null;
  let loading = null;
  const baseUrl = (document.documentElement.getAttribute('data-baseurl') || '').replace(/\/$/, '');
  const indexUrl = `${baseUrl}/assets/js/data/search.json`;

  async function loadIndex() {
    if (index) {
      return index;
    }

    if (!loading) {
      loading = fetch(indexUrl)
        .then((res) => res.json())
        .then((data) => {
          index = Array.isArray(data) ? data : [];
          return index;
        })
        .catch(() => {
          index = [];
          return index;
        });
    }

    return loading;
  }

  function highlight(text, query) {
    const idx = text.toLowerCase().indexOf(query);
    if (idx < 0) {
      return text;
    }
    return `${text.slice(0, idx)}<mark>${text.slice(idx, idx + query.length)}</mark>${text.slice(idx + query.length)}`;
  }

  function buildSnippet(content, query) {
    const clean = content.replace(/\s+/g, ' ').trim();
    const lower = clean.toLowerCase();
    const idx = lower.indexOf(query);
    if (idx < 0) {
      return clean.slice(0, 160);
    }
    const start = Math.max(0, idx - 60);
    const end = Math.min(clean.length, idx + 100);
    const snippet = clean.slice(start, end);
    return (start > 0 ? '…' : '') + snippet + (end < clean.length ? '…' : '');
  }

  function render(items, query) {
    results.innerHTML = '';

    if (!items.length) {
      results.innerHTML = '<p class="search-empty">No results found.</p>';
      return;
    }

    const html = items
      .slice(0, 12)
      .map((item) => {
        const snippet = buildSnippet(item.content || '', query);
        return `
          <article class="search-result">
            <h3><a href="${item.url}">${highlight(item.title, query)}</a></h3>
            <div class="search-meta">
              <span>${item.categories || ''}</span>
              <span>${item.tags || ''}</span>
              <span>${item.date || ''}</span>
            </div>
            <p>${highlight(snippet, query)}</p>
          </article>
        `;
      })
      .join('');

    results.innerHTML = html;
  }

  function scoreItem(item, query) {
    let score = 0;
    const q = query.toLowerCase();
    const title = (item.title || '').toLowerCase();
    const tags = (item.tags || '').toLowerCase();
    const categories = (item.categories || '').toLowerCase();
    const content = (item.content || '').toLowerCase();

    if (title.includes(q)) score += 5;
    if (tags.includes(q)) score += 3;
    if (categories.includes(q)) score += 2;
    if (content.includes(q)) score += 1;

    return score;
  }

  let debounce = null;

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        results.innerHTML = '';
        hints?.classList.remove('d-none');
        return;
      }

      hints?.classList.add('d-none');
      const data = await loadIndex();
      const filtered = data
        .map((item) => ({ item, score: scoreItem(item, query) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item);

      render(filtered, query);
    }, 120);
  });
}
