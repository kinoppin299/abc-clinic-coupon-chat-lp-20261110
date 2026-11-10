/* Carry advertising identifiers only; diagnosis answers are never forwarded. */
(() => {
  const allowed = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','ttclid','gclid','gbraid','wbraid','msclkid','yclid','campaign_id','adset_id','ad_id','creative_id']);
  const pairs = [...new URLSearchParams(location.search)].filter(([key,value]) => allowed.has(key) && value.trim() && !/[\u0000-\u001f\u007f]/.test(value));
  if (!pairs.length) return;
  const decorate = anchor => {
    const target = new URL(anchor.href, location.href);
    if (target.origin !== 'https://s8affi.net' || target.pathname !== '/link.php' || target.searchParams.get('i') !== 'piiccuhxqro5' || target.searchParams.get('m') !== 'miiccwbhis7s') return;
    const existing = new Set(target.searchParams.keys());
    for (const [key,value] of pairs) if (!existing.has(key)) target.searchParams.append(key,value);
    anchor.href = target.href;
  };
  document.querySelectorAll('a[data-lp-chat-cta]').forEach(decorate);
  document.addEventListener('click', event => {
    const anchor = event.target instanceof Element ? event.target.closest('a[data-lp-chat-cta]') : null;
    if (anchor) decorate(anchor);
  }, true);
})();
