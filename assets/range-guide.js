/* Explain the gesture without moving the input or changing its value. */
(() => {
  const root = document.querySelector('[data-lp-scenario-chat="1"]');
  if (!root) return;
  const guides = [...root.querySelectorAll('[data-range-guide]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new WeakSet();
  const update = () => guides.forEach(guide => {
    guide.dataset.rangeGuideState = visible.has(guide) && guide.dataset.rangeGuideTouched !== '1' && !document.hidden && !reduced.matches ? 'running' : 'paused';
  });
  const touched = id => {
    const guide = guides.find(item => item.dataset.rangeGuide === id);
    if (!guide) return;
    guide.dataset.rangeGuideTouched = '1';
    root.querySelector('[data-range-guide-label="' + id + '"]').textContent = '＋／−で微調整できます';
    update();
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
      update();
    });
    guides.forEach(guide => observer.observe(guide));
  }
  for (const type of ['pointerdown', 'input', 'keydown']) root.addEventListener(type, event => {
    const range = event.target instanceof Element ? event.target.closest('input.measurement-range') : null;
    if (range && (type !== 'keydown' || ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key))) touched(range.closest('[data-range-guide]').dataset.rangeGuide);
  }, true);
  root.addEventListener('click', event => {
    const control = event.target instanceof Element ? event.target.closest('[data-lp-chat-action]') : null;
    if (!control) return;
    if (['plus','minus'].includes(control.dataset.lpChatAction)) touched(control.dataset.lpChatQuestion);
    if (control.dataset.lpChatAction === 'restart') {
      for (const guide of guides) {
        delete guide.dataset.rangeGuideTouched;
        root.querySelector('[data-range-guide-label="' + guide.dataset.rangeGuide + '"]').textContent = 'ここを左右にスライド';
      }
      update();
    }
  });
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  update();
})();
