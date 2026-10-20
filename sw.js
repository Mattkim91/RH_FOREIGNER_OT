/* 재활 연수자 가이드 서비스 워커
   HTML은 네트워크 우선이라 온라인이면 옛 index.html에 갇히지 않습니다.
   오프라인이면 마지막으로 저장한 페이지를 엽니다.
   글꼴과 매니페스트는 캐시를 먼저 씁니다.
*/
const CACHE = 'rehab-guide-v1';
const FONT_CSS = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
const ICON_192 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAACXBIWXMAAAABAAAAAQBPJcTWAAAB6klEQVR4nO3SMQ0AIADAMAygEA34f/HADkLSpAJ2bMy94Np4XsDXDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjEQiYFIDERiIBIDkRiIxEAkBiIxEImBSAxEYiASA5EYiMRAJAYiMRCJgUgMRGIgEgORGIjEQCQGIjkpvdb6IVPongAAAABJRU5ErkJggg==';
const ICON_512 = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAACXBIWXMAAAABAAAAAQBPJcTWAAAHIElEQVR4nO3VMQ0AMAzAsBIYwmEY/3cwesSSAeTLnHcBCJr1AgBWGABAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEGQBAlAEARBkAQJQBAEQZAECUAQBEfW1RMe1UgsAiAAAAAElFTkSuQmCC';

function pngResponse(b64){
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, {headers:{'Content-Type':'image/png', 'Cache-Control':'public, max-age=86400'}});
}

function manifestResponse(){
  const scope = self.registration.scope;
  const manifest = {
    name: '재활치료실 연수자 가이드',
    short_name: '재활가이드',
    start_url: new URL('index.html', scope).href,
    scope: scope,
    display: 'standalone',
    background_color: '#F1F4F1',
    theme_color: '#0E6E5C',
    lang: 'ko',
    icons: [
      {src: new URL('icon-192.png', scope).href, sizes:'192x192', type:'image/png', purpose:'any'},
      {src: new URL('icon-512.png', scope).href, sizes:'512x512', type:'image/png', purpose:'any'}
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers:{'Content-Type':'application/manifest+json', 'Cache-Control':'no-cache'}
  });
}

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

async function networkFirst(request){
  const cache = await caches.open(CACHE);
  try{
    const fresh = await fetch(request);
    if(fresh && fresh.ok){
      try{ await cache.put(request, fresh.clone()); }catch(e){}
    }
    return fresh;
  }catch(e){
    const cached = await cache.match(request)
      || await cache.match('./index.html')
      || await cache.match('./');
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
  if(fresh && fresh.ok) await cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener('install', event=>{
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE);
    const scope = self.registration.scope;
    await cache.add(new URL('index.html', scope).href);
    try{ await cache.add(new URL('./', scope).href); }catch(e){}
    try{ await cacheFonts(cache); }catch(e){}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event=>{
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method!=='GET') return;
  const url = new URL(req.url);
  if(url.origin===self.location.origin && url.pathname.endsWith('/manifest.webmanifest')){
    event.respondWith(manifestResponse());
    return;
  }
  if(url.origin===self.location.origin && url.pathname.endsWith('/icon-192.png')){
    event.respondWith(pngResponse(ICON_192));
    return;
  }
  if(url.origin===self.location.origin && url.pathname.endsWith('/icon-512.png')){
    event.respondWith(pngResponse(ICON_512));
    return;
  }
  const isHtml = req.mode==='navigate' || (url.origin===self.location.origin && (url.pathname.endsWith('.html') || url.pathname.endsWith('/')));
  if(isHtml){
    event.respondWith(networkFirst(req));
    return;
  }
  if(url.hostname==='cdn.jsdelivr.net' || url.hostname.endsWith('.jsdelivr.net')){
    event.respondWith(cacheFirst(req));
  }
});
