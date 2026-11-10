/* Animate the main coupon CTA only while it is visible and motion is allowed. */
(() => {
  const cta = document.getElementById('abc-v5-line_confirm-yes');
  if (!cta) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const update = () => {
    cta.dataset.ctaMotion = visible && !document.hidden && !reduced.matches ? 'running' : 'paused';
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      update();
    }, {threshold: [0, 0.25]}).observe(cta);
  }
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  update();
})();
