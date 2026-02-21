export function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  const railBar = document.getElementById('reading-progress-rail');
  const railValue = document.getElementById('reading-progress-value');

  if (!bar) {
    return;
  }

  function update() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    bar.style.width = `${progress}%`;
    if (railBar) {
      railBar.style.width = `${progress}%`;
    }
    if (railValue) {
      railValue.textContent = `${Math.round(progress)}%`;
    }
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
