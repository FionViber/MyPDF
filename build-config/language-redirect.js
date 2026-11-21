(function () {
  const script = document.currentScript;
  if (!script) return;
  const base = (script.getAttribute('data-base') || '/').replace(/\/?$/, '/');
  const codes = ['en', ...(script.getAttribute('data-languages') || '').split(',').filter(Boolean)];
  const url = new URL(location.href);
  const path = url.pathname === base.slice(0, -1) ? '' :
    url.pathname.startsWith(base) ? url.pathname.slice(base.length) : null;
  if (path === null || /^(?:blog|docs|assets|locales)(?:\/|$)/.test(path)) return;
  const first = path.split('/')[0];
  const present = codes.includes(first) ? first : 'en';
  const rest = codes.includes(first) ? path.slice(first.length).replace(/^\//,'') : path;
  function supported(raw) {
    if (!raw) return null;
    try {
      const l = new Intl.Locale(raw.replace(/_/g, '-'));
      if (l.language === 'zh') {
        if (l.script) return l.script === 'Hant' ? 'zh-TW' : 'zh';
        return ['TW','HK','MO'].includes(l.region) ? 'zh-TW' : 'zh';
      }
      return codes.includes(l.language) ? l.language : null;
    } catch { return null; }
  }
  let choice;
  try { choice = localStorage.getItem('bentopdf-language'); } catch {}
  const param = url.searchParams.get('lang');
  const explicit = supported(param);
  if (!param && codes.includes(first)) return;
  const preferred = [...(navigator.languages || []),navigator.language].map(supported).find(Boolean) || 'en';
  const target = explicit || (param === 'auto' ? preferred : supported(choice) || preferred);
  if (target === present && first !== 'en') return;
  url.pathname = base + (target === 'en' ? '' : target + '/') + (rest === 'index.html' ? '' : rest);
  if (explicit && target !== 'en') url.searchParams.delete('lang');
  location.replace(url.href);
})();
