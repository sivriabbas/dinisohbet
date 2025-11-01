// Service Worker - Dini Portal PWA
const CACHE_NAME = 'dini-portal-v1';
const DYNAMIC_CACHE = 'dini-portal-dynamic-v1';

// Önbelleğe alınacak statik dosyalar
const STATIC_ASSETS = [
  '/',
  '/css/style.css',
  '/css/new-styles.css',
  '/js/main.js',
  '/manifest.json',
  '/offline.html'
];

// Service Worker Kurulumu
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
  
  // Hemen aktif et
  self.skipWaiting();
});

// Service Worker Aktivasyonu
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Tüm client'ları kontrol et
  return self.clients.claim();
});

// Fetch olayları - Cache stratejisi
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Sadece kendi origin'imizden gelen istekleri cache'le
  if (url.origin !== location.origin) {
    return;
  }
  
  // API istekleri için Network First stratejisi
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Statik dosyalar için Cache First stratejisi
  event.respondWith(cacheFirst(request));
});

// Cache First Stratejisi (Statik dosyalar için)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Sadece başarılı GET isteklerini cache'le
    if (request.method === 'GET' && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Offline sayfası göster
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    return new Response('Offline - İnternet bağlantınızı kontrol edin', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network First Stratejisi (API istekleri için)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Başarılı yanıtları cache'le
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Push Notification desteği
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'dini-portal-notification',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Aç', icon: '/images/icon-open.png' },
      { action: 'close', title: 'Kapat', icon: '/images/icon-close.png' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Dini Portal', options)
  );
});

// Notification click olayı
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background Sync desteği (opsiyonel)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Arka planda veri senkronizasyonu
  console.log('[Service Worker] Syncing data...');
  // Burada offline yapılan işlemleri senkronize edebiliriz
}

// Mesaj dinleme
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
    );
  }
});
