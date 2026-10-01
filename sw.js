const CACHE = 'zekr-v3';
const FONT_CACHE = 'zekr-fonts-v2';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon.svg'
];

const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Amiri+Quran&family=Lalezar&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(u => c.add(u).catch(()=>{})));

    const fc = await caches.open(FONT_CACHE);
    for (const url of FONT_URLS){
      try{
        const res = await fetch(url, { mode:'cors' });
        if (!res.ok) continue;
        await fc.put(url, res.clone());
        const css = await res.text();
        const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.(?:woff2?|ttf|otf))\)/g)].map(m=>m[1]);
        await Promise.all(urls.map(u => fetch(u,{mode:'cors'}).then(r => r.ok && fc.put(u, r)).catch(()=>{})));
      }catch{}
    }
  })());
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k!==CACHE && k!==FONT_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;
  const isFont =
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    /\.(woff2?|ttf|otf|eot)(\?|$)/.test(url);

  if (isFont){
    e.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try{
        const res = await fetch(e.request);
        if (res && res.status === 200) cache.put(e.request, res.clone());
        return res;
      }catch{
        return cached || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const network = fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic'){
        cache.put(e.request, res.clone()).catch(()=>{});
      }
      return res;
    }).catch(()=>null);

    return cached || (await network) || caches.match('./index.html');
  })());
});
