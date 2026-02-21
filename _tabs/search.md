---
icon: fas fa-magnifying-glass
order: 5
title: Search
---

<p>Use the search bar in the header to quickly find posts, tags, and notes. You can also click the button below.</p>

<p>
  <button class="cta-link" id="open-search" type="button">Open search</button>
</p>

<script>
  document.getElementById('open-search')?.addEventListener('click', () => {
    document.getElementById('search-trigger')?.click();
  });
</script>
