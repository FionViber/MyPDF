(() => {
  const script = document.currentScript;
  const base = new URL('./', script.src);
  const page = document.documentElement;
  page.dataset.officeIsolation = self.crossOriginIsolated ? 'ready' : 'pending';
  if (self.crossOriginIsolated) return;

  // Most static hosts can set COOP/COEP directly. GitHub Pages needs a controlled navigation.
  const target = new URL(location.pathname.split('/').filter(Boolean).pop(), 'https://mypdf-zdf.pages.dev/');
  target.search = location.search;
  let status, alternate, blocked, finished = false;
  function present() {
    const box = document.getElementById('drop-zone');
    if (!box || finished) return;
    blocked = box;
    box.inert = true;
    const message = document.createElement('p');
    message.className = 'text-gray-300 my-3';
    message.setAttribute('role','status');
    status = document.createElement('span');
    status.textContent = 'Preparing the local Office converter. ';
    alternate = document.createElement('a');
    alternate.href = target.href;
    alternate.textContent = 'Open the isolated Cloudflare edition';
    alternate.style.textDecoration = 'underline';
    message.append(status);
    if(location.origin !== target.origin) message.append(alternate);
    box.before(message);
  }
  function unavailable() {
    page.dataset.officeIsolation = 'unavailable';
    if(status) status.textContent = 'This browser has not enabled the isolation required by Office conversion. ';
    if(location.origin === target.origin && blocked) blocked.inert = false;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',present,{once:true});
  else present();
  setTimeout(unavailable, 9000);
  if (!('serviceWorker' in navigator)) return;
  const key='mypdf:office-isolation:'+base.pathname;
  let last=0;
  try { last=Number(sessionStorage.getItem(key)); } catch {}
  if(Date.now()-last<30000)return;
  function refresh(){
    if(finished||self.crossOriginIsolated)return;
    finished=true;
    try{sessionStorage.setItem(key,String(Date.now()));}catch{return}
    location.reload();
  }
  navigator.serviceWorker.register(new URL('sw.js',base),{scope:base.pathname,updateViaCache:'none'})
    .then(()=>navigator.serviceWorker.ready).then(()=>{
      if(navigator.serviceWorker.controller)refresh();
      else navigator.serviceWorker.addEventListener('controllerchange',refresh,{once:true});
    }).catch(unavailable);
})();
