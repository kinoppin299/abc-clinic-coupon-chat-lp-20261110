/* Keep the coupon image at its current viewport position when its cover opens. */
(() => {
  const root = document.querySelector('[data-lp-scenario-chat="1"]');
  const step = root?.querySelector('[data-lp-chat-step="scratch"]');
  const pending = step?.querySelector('[data-lp-chat-unanswered="scratch"]');
  const revealed = step?.querySelector('[data-lp-chat-answered="scratch"]');
  if (!pending || !revealed) return;
  let anchorTop = null;
  const remember = event => {
    if (pending.hidden || !(event.target instanceof Element) || !pending.contains(event.target)) return;
    anchorTop = pending.querySelector('.scratch-surface').getBoundingClientRect().top;
  };
  for (const type of ['pointerdown', 'pointermove', 'click']) step.addEventListener(type, remember, true);
  new MutationObserver(() => {
    if (!pending.hidden || revealed.hidden || anchorTop === null) return;
    const keepTop = anchorTop;
    step.dataset.scratchRevealAnchorTop = String(keepTop);
    anchorTop = null;
    const align = () => {
      const top = revealed.querySelector('.scratch-surface').getBoundingClientRect().top;
      window.scrollTo({left: window.scrollX, top: window.scrollY + top - keepTop, behavior: 'instant'});
    };
    align();
    // Reapply after native focus/scroll anchoring settles in the next paint.
    requestAnimationFrame(align);
  }).observe(step, {subtree: true, attributes: true, attributeFilter: ['hidden']});
})();
