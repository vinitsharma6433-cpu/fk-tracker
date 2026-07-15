// FK Profit Tracker service worker — NETWORK FIRST (hamesha nayi file laata hai)
const CACHE='fk-v3';
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))) // purani cache saaf
    .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e=>{
  const u=e.request.url;
  if(u.includes('firebaseio.com')||u.includes('googleapis.com')||u.includes('cloudflare')) return;
  // hamesha pehle internet se nayi file lao; net na ho tabhi cache
  e.respondWith(
    fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return resp;
    }).catch(()=> caches.match(e.request).then(r=> r || caches.match('./index.html')))
  );
});
