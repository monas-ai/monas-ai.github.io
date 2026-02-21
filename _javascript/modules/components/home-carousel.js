export function initHomeCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) {
    return;
  }

  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');

  if (!track || !prev || !next) {
    return;
  }

  function scrollByCard(dir) {
    const card = track.querySelector('.carousel-card');
    if (!card) {
      return;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap || '24');
    const amount = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
}
