/* 재활 연수자 가이드 서비스 워커
   HTML은 네트워크를 먼저 보되, 약 3.5초 안에 답이 없으면 저장본을 엽니다.
   네트워크 응답이 늦게 도착하면 캐시만 갱신합니다.
*/
const CACHE_PREFIX = 'rehab-guide-';
const CACHE = 'rehab-guide-v5';
const FONT_CSS = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
const NET_TIMEOUT_MS = 3500;

async function cacheFonts(cache){
  const cssRes = await fetch(FONT_CSS, {mode:'cors'});
  if(!cssRes.ok) return;
  const css = await cssRes.clone().text();
  await cache.put(FONT_CSS, cssRes);
  const found = css.match(/url\(([^)]+)\)/g) || [];
  const urls = [];
  found.forEach(raw=>{
    const inner = raw.slice(4, -1).replace(/["']/g,'').trim();
    if(!inner.includes('woff2')) return;
    urls.push(new URL(inner, FONT_CSS).href);
  });
  await Promise.all(urls.map(async (u)=>{
    try{
      const res = await fetch(u, {mode:'cors'});
      if(res.ok) await cache.put(u, res);
    }catch(e){}
  }));
}

function matchCached(cache, request){
  return cache.match(request)
    .then(hit => hit || cache.match('./index.html'))
    .then(hit => hit || cache.match('./'));
}

async function networkFirst(request){
  const cache = await caches.open(CACHE);
  const cached = await matchCached(cache, request);
  const net = fetch(request).then(res=>{
    if(res && res.ok){
      cache.put(request, res.clone()).catch(()=>{});
    }
    return res;
  });
  let timer;
  const timeout = new Promise(resolve => { timer = setTimeout(()=>resolve(null), NET_TIMEOUT_MS); });
  try{
    const fresh = await Promise.race([net.catch(()=>null), timeout]);
    clearTimeout(timer);
    if(fresh) return fresh;
    if(cached) return cached;
    return await net;
  }catch(e){
    clearTimeout(timer);
    if(cached) return cached;
    return new Response('오프라인 상태이고 저장된 페이지가 없습니다.', {
      status:503, headers:{'Content-Type':'text/plain;charset=utf-8'}
    });
  }
}

async function cacheFirst(request){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if(hit) return hit;
  const fresh = await fetch(request);
  if(fresh && fresh.ok){
    try{ await cache.put(request, fresh.clone()); }catch(e){}
  }
  return fresh;
}

self.addEventListener('install', event=>{
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE);
    const scope = self.registration.scope;
    const files = ['index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
    await Promise.all(files.map(async name=>{
      try{ await cache.add(new URL(name, scope).href); }catch(e){}
    }));
    try{ await cache.add(new URL('./', scope).href); }catch(e){}
    try{ await cacheFonts(cache); }catch(e){}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event=>{
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX) && k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method!=='GET') return;
  const url = new URL(req.url);
  const isHtml = req.mode==='navigate' || (url.origin===self.location.origin && (url.pathname.endsWith('.html') || url.pathname.endsWith('/')));
  if(isHtml){
    event.respondWith(networkFirst(req));
    return;
  }
  if(url.origin===self.location.origin || url.hostname==='cdn.jsdelivr.net' || url.hostname.endsWith('.jsdelivr.net')){
    event.respondWith(cacheFirst(req));
  }
});
