export function initCodeWrap() {
  document.querySelectorAll('.wrap-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const header = btn.closest('.code-header');
      const block = header?.nextElementSibling;
      if (!block) {
        return;
      }
      block.classList.toggle('wrap-lines');
      btn.classList.toggle('is-active');
    });
  });
}
