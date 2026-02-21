function getReadingBucket(value) {
  const minutes = Number(value || 0);
  if (!minutes) {
    return 'unknown';
  }
  if (minutes <= 3) return '0-3';
  if (minutes <= 7) return '4-7';
  if (minutes <= 12) return '8-12';
  return '13+';
}

function getPageMeta() {
  const article = document.querySelector('article.post');
  if (!article) {
    return {};
  }

  const tags = (article.dataset.postTags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    post_slug: article.dataset.postSlug || '',
    post_category: article.dataset.postCategory || '',
    post_tags: tags.join(','),
    content_type: article.dataset.contentType || '',
    reading_time_bucket: getReadingBucket(article.dataset.readingTime)
  };
}

function dntEnabled() {
  return (
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1'
  );
}

function track(provider, name, data = {}) {
  if (!provider) {
    return;
  }

  if (provider === 'umami' && window.umami && typeof window.umami.track === 'function') {
    window.umami.track(name, data);
  }
}

export function initAnalytics() {
  const provider = document.body?.dataset?.analytics;
  if (!provider || dntEnabled()) {
    return;
  }

  const meta = getPageMeta();

  track(provider, 'page_view', meta);

  const engagedSteps = [10, 30, 60, 120];
  engagedSteps.forEach((seconds) => {
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        track(provider, 'engaged_time', { ...meta, seconds });
      }
    }, seconds * 1000);
  });

  const depthMarks = [25, 50, 75, 100];
  const firedDepth = new Set();
  const onScroll = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    depthMarks.forEach((mark) => {
      if (percent >= mark && !firedDepth.has(mark)) {
        firedDepth.add(mark);
        track(provider, 'scroll_depth', { ...meta, depth: mark });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    if (url.host && url.host !== window.location.host) {
      track(provider, 'outbound_click', { ...meta, domain: url.host });
    }
  });

  document.addEventListener('code:copied', (e) => {
    track(provider, 'copy_code', { ...meta, language: e.detail?.language || 'unknown' });
  });

  document.addEventListener('link:copied', () => {
    track(provider, 'share_click', { ...meta, channel: 'copy_link' });
  });

  document.addEventListener('filter:tag', (e) => {
    track(provider, 'filter_tag', { ...meta, tag: e.detail?.tag || '' });
  });

  document.addEventListener('filter:category', (e) => {
    track(provider, 'filter_category', { ...meta, category: e.detail?.category || '' });
  });

  document.querySelectorAll('[data-share]').forEach((btn) => {
    btn.addEventListener('click', () => {
      track(provider, 'share_click', { ...meta, channel: btn.dataset.share || '' });
    });
  });

  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      track(provider, 'subscribe_submit', { ...meta, source: 'homepage' });
      subscribeForm.classList.add('is-submitted');
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (!query) {
          return;
        }
        const resultCount = document.querySelectorAll('#search-results article').length;
        track(provider, 'search', {
          ...meta,
          query_length: query.length,
          result_count: resultCount
        });
      }, 500);
    });
  }
}
