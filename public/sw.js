// Advanced Service Worker - DiniSohbet PWA
// Version 2.0 - Enhanced Offline Support with IndexedDB

const CACHE_VERSION = 'dinisohbet-v2.0';
const STATIC_CACHE = 'dinisohbet-static-v2.0';
const DYNAMIC_CACHE = 'dinisohbet-dynamic-v2.0';
const IMAGE_CACHE = 'dinisohbet-images-v2.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/css/style.css',
    '/css/new-styles.css',
    '/css/widgets.css',
    '/css/themes.css',
    '/js/main.js',
    '/js/pwa.js',
    '/js/widgets.js',
    '/js/themes.js',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// IndexedDB configuration
const DB_NAME = 'DiniSohbetDB';
const DB_VERSION = 1;
const STORES = {
    QURAN: 'quran',
    HADITHS: 'hadiths',
    DUAS: 'duas',
    POSTS: 'posts',
    SYNC_QUEUE: 'syncQueue'
};

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.error('[Service Worker] Installation failed:', err))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('dinisohbet-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
                        .map(name => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // API requests - network first with IndexedDB backup
    if (url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/quran/') || 
        url.pathname.startsWith('/hadiths/') || 
        url.pathname.startsWith('/duas/')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Images - cache first
    if (request.destination === 'image') {
        event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
        return;
    }

    // Static assets - cache first
    if (STATIC_ASSETS.some(asset => url.pathname === asset || url.href === asset)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // Default - network first with cache fallback
    event.respondWith(networkFirstStrategy(request));
});

// Network first strategy
async function networkFirstStrategy(request) {
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response && response.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
            
            // Store in IndexedDB for specific content
            storeInIndexedDB(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);
        
        // Try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try IndexedDB
        const dbResponse = await getFromIndexedDB(request);
        if (dbResponse) {
            return dbResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/');
        }
        
        throw error;
    }
}

// Cache first strategy
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const response = await fetch(request);
        
        if (response && response.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        throw error;
    }
}

// IndexedDB operations
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains(STORES.QURAN)) {
                const quranStore = db.createObjectStore(STORES.QURAN, { keyPath: 'id' });
                quranStore.createIndex('surahNumber', 'surahNumber', { unique: false });
            }
            
            if (!db.objectStoreNames.contains(STORES.HADITHS)) {
                const hadithStore = db.createObjectStore(STORES.HADITHS, { keyPath: 'id' });
                hadithStore.createIndex('source', 'source', { unique: false });
            }
            
            if (!db.objectStoreNames.contains(STORES.DUAS)) {
                db.createObjectStore(STORES.DUAS, { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains(STORES.POSTS)) {
                const postsStore = db.createObjectStore(STORES.POSTS, { keyPath: 'id' });
                postsStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
                const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
                syncStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

async function storeInIndexedDB(request, response) {
    try {
        const url = new URL(request.url);
        const pathname = url.pathname;
        
        // Only store specific content types
        if (!pathname.includes('/quran/') && 
            !pathname.includes('/hadiths/') && 
            !pathname.includes('/duas/') && 
            !pathname.includes('/posts/')) {
            return;
        }
        
        const data = await response.json();
        const db = await openDB();
        
        let storeName;
        if (pathname.includes('/quran/')) storeName = STORES.QURAN;
        else if (pathname.includes('/hadiths/')) storeName = STORES.HADITHS;
        else if (pathname.includes('/duas/')) storeName = STORES.DUAS;
        else if (pathname.includes('/posts/')) storeName = STORES.POSTS;
        
        if (storeName && data) {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.id || item._id) {
                        item.id = item.id || item._id;
                        store.put(item);
                    }
                });
            } else if (data.id || data._id) {
                data.id = data.id || data._id;
                store.put(data);
            }
            
            await transaction.complete;
        }
    } catch (error) {
        console.error('[Service Worker] IndexedDB store failed:', error);
    }
}

async function getFromIndexedDB(request) {
    try {
        const url = new URL(request.url);
        const pathname = url.pathname;
        
        const db = await openDB();
        
        let storeName;
        if (pathname.includes('/quran/')) storeName = STORES.QURAN;
        else if (pathname.includes('/hadiths/')) storeName = STORES.HADITHS;
        else if (pathname.includes('/duas/')) storeName = STORES.DUAS;
        else if (pathname.includes('/posts/')) storeName = STORES.POSTS;
        
        if (!storeName) return null;
        
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const data = await store.getAll();
        
        if (data && data.length > 0) {
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return null;
    } catch (error) {
        console.error('[Service Worker] IndexedDB get failed:', error);
        return null;
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-posts') {
        event.waitUntil(syncPosts());
    } else if (event.tag === 'sync-comments') {
        event.waitUntil(syncComments());
    } else if (event.tag === 'sync-likes') {
        event.waitUntil(syncLikes());
    }
});

async function syncPosts() {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
        const store = transaction.objectStore(STORES.SYNC_QUEUE);
        const queue = await store.getAll();
        
        const postQueue = queue.filter(item => item.type === 'post');
        
        for (const item of postQueue) {
            try {
                const response = await fetch('/posts/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.data)
                });
                
                if (response.ok) {
                    // Remove from queue
                    const deleteTransaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
                    const deleteStore = deleteTransaction.objectStore(STORES.SYNC_QUEUE);
                    await deleteStore.delete(item.id);
                }
            } catch (error) {
                console.error('[Service Worker] Sync failed for item:', item.id, error);
            }
        }
    } catch (error) {
        console.error('[Service Worker] syncPosts failed:', error);
    }
}

async function syncComments() {
    // Similar to syncPosts
    console.log('[Service Worker] Syncing comments...');
}

async function syncLikes() {
    // Similar to syncPosts
    console.log('[Service Worker] Syncing likes...');
}

// Push notification support
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'DiniSohbet';
    const options = {
        body: data.body || 'Yeni bildiriminiz var',
        icon: '/images/icon-192x192.png',
        badge: '/images/icon-192x192.png',
        data: data.url || '/',
        vibrate: [200, 100, 200],
        tag: data.tag || 'notification'
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});

// Message handler for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_QURAN') {
        event.waitUntil(cacheQuranContent(event.data.surahs));
    }
    
    if (event.data && event.data.type === 'CACHE_HADITHS') {
        event.waitUntil(cacheHadithContent(event.data.hadiths));
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(getCacheSize().then(size => {
            event.ports[0].postMessage({ size });
        }));
    }
});

async function cacheQuranContent(surahs) {
    console.log('[Service Worker] Caching Quran content');
    
    const db = await openDB();
    const transaction = db.transaction([STORES.QURAN], 'readwrite');
    const store = transaction.objectStore(STORES.QURAN);
    
    for (const surah of surahs) {
        await store.put(surah);
    }
    
    console.log('[Service Worker] Quran content cached');
}

async function cacheHadithContent(hadiths) {
    console.log('[Service Worker] Caching Hadith content');
    
    const db = await openDB();
    const transaction = db.transaction([STORES.HADITHS], 'readwrite');
    const store = transaction.objectStore(STORES.HADITHS);
    
    for (const hadith of hadiths) {
        await store.put(hadith);
    }
    
    console.log('[Service Worker] Hadith content cached');
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    // Clear IndexedDB
    const db = await openDB();
    const stores = [STORES.QURAN, STORES.HADITHS, STORES.DUAS, STORES.POSTS, STORES.SYNC_QUEUE];
    
    for (const storeName of stores) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
    }
    
    console.log('[Service Worker] All caches cleared');
}

async function getCacheSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
        };
    }
    return null;
}

console.log('[Service Worker] Loaded successfully');
