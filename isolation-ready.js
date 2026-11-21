(() => {
  const script = document.currentScript;
  document.documentElement.dataset.officeIsolation = window.crossOriginIsolated ? 'ready' : 'pending';
  document.documentElement.dataset.officeController = navigator.serviceWorker?.controller?.scriptURL || '';

  if (!script || window.crossOriginIsolated || !('serviceWorker' in navigator)) return;
  const root = new URL('./', script.src);
  const key = 'mypdf:coi:' + root.pathname;
  let previous = 0;
  try { previous = Number(sessionStorage.getItem(key)); } catch {}
  if (Date.now() - previous < 30000) return;
  navigator.serviceWorker.register(new URL('sw.js', root), {scope:root.pathname})
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      if (window.crossOriginIsolated) return;
      const reload = () => {
        try { sessionStorage.setItem(key, String(Date.now())); } catch { return; }
        location.reload();
      };
      if (navigator.serviceWorker.controller) reload();
      else navigator.serviceWorker.addEventListener('controllerchange', reload, {once:true});
    }).catch(() => {});
})();
