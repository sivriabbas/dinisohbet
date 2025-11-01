// Offline Manager - Advanced offline functionality
class OfflineManager {
    constructor() {
        this.db = null;
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        // Monitor online/offline status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Open IndexedDB
        await this.openDatabase();

        // Update UI
        this.updateOnlineStatus();

        // Check service worker
        this.checkServiceWorker();
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DiniSohbetDB', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('quran')) {
                    const quranStore = db.createObjectStore('quran', { keyPath: 'id' });
                    quranStore.createIndex('surahNumber', 'surahNumber', { unique: false });
                }

                if (!db.objectStoreNames.contains('hadiths')) {
                    const hadithStore = db.createObjectStore('hadiths', { keyPath: 'id' });
                    hadithStore.createIndex('source', 'source', { unique: false });
                }

                if (!db.objectStoreNames.contains('duas')) {
                    db.createObjectStore('duas', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('posts')) {
                    const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
                    postsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('syncQueue')) {
                    const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    handleOnline() {
        this.isOnline = true;
        this.updateOnlineStatus();
        this.syncOfflineActions();
        this.showNotification('Bağlantı sağlandı', 'İnternet bağlantınız yeniden kuruldu', 'success');
    }

    handleOffline() {
        this.isOnline = false;
        this.updateOnlineStatus();
        this.showNotification('Bağlantı kesildi', 'Offline modda çalışıyorsunuz', 'warning');
    }

    updateOnlineStatus() {
        const statusElement = document.getElementById('onlineStatus');
        if (statusElement) {
            if (this.isOnline) {
                statusElement.innerHTML = '<i class="fas fa-wifi"></i> Çevrimiçi';
                statusElement.className = 'online-status online';
            } else {
                statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i> Çevrimdışı';
                statusElement.className = 'online-status offline';
            }
        }
    }

    async checkServiceWorker() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            console.log('Service Worker ready:', registration);
        }
    }

    // Cache Quran content for offline
    async cacheQuranContent(surahNumber = null) {
        try {
            const url = surahNumber ? `/quran/surah/${surahNumber}` : '/quran/all';
            const response = await fetch(url);
            const data = await response.json();

            const transaction = this.db.transaction(['quran'], 'readwrite');
            const store = transaction.objectStore('quran');

            if (Array.isArray(data)) {
                for (const item of data) {
                    await store.put(item);
                }
            } else {
                await store.put(data);
            }

            return { success: true, count: Array.isArray(data) ? data.length : 1 };
        } catch (error) {
            console.error('Failed to cache Quran:', error);
            return { success: false, error: error.message };
        }
    }

    // Cache Hadith content for offline
    async cacheHadithContent(source = null, limit = 100) {
        try {
            const url = source ? `/hadiths?source=${source}&limit=${limit}` : `/hadiths?limit=${limit}`;
            const response = await fetch(url);
            const data = await response.json();

            const transaction = this.db.transaction(['hadiths'], 'readwrite');
            const store = transaction.objectStore('hadiths');

            for (const hadith of data) {
                await store.put(hadith);
            }

            return { success: true, count: data.length };
        } catch (error) {
            console.error('Failed to cache Hadiths:', error);
            return { success: false, error: error.message };
        }
    }

    // Cache Duas for offline
    async cacheDuaContent() {
        try {
            const response = await fetch('/duas/all');
            const data = await response.json();

            const transaction = this.db.transaction(['duas'], 'readwrite');
            const store = transaction.objectStore('duas');

            for (const dua of data) {
                await store.put(dua);
            }

            return { success: true, count: data.length };
        } catch (error) {
            console.error('Failed to cache Duas:', error);
            return { success: false, error: error.message };
        }
    }

    // Get cached content
    async getCachedContent(storeName, id = null) {
        try {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            if (id) {
                const data = await store.get(id);
                return data;
            } else {
                const data = await store.getAll();
                return data;
            }
        } catch (error) {
            console.error('Failed to get cached content:', error);
            return null;
        }
    }

    // Add to sync queue
    async addToSyncQueue(type, data) {
        try {
            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');

            const item = {
                type,
                data,
                timestamp: Date.now()
            };

            await store.add(item);

            // Register background sync if available
            if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register(`sync-${type}s`);
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to add to sync queue:', error);
            return { success: false, error: error.message };
        }
    }

    // Sync offline actions when back online
    async syncOfflineActions() {
        if (!this.isOnline) return;

        try {
            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            const queue = await store.getAll();

            for (const item of queue) {
                try {
                    let endpoint;
                    if (item.type === 'post') endpoint = '/posts/create';
                    else if (item.type === 'comment') endpoint = '/posts/comment';
                    else if (item.type === 'like') endpoint = '/posts/like';

                    if (endpoint) {
                        const response = await fetch(endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(item.data)
                        });

                        if (response.ok) {
                            await store.delete(item.id);
                        }
                    }
                } catch (error) {
                    console.error('Sync failed for item:', item.id, error);
                }
            }

            this.showNotification('Senkronizasyon tamamlandı', 'Offline işlemleriniz senkronize edildi', 'success');
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    // Get storage info
    async getStorageInfo() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
                quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
                percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
        }
        return null;
    }

    // Clear all offline data
    async clearOfflineData() {
        try {
            const stores = ['quran', 'hadiths', 'duas', 'posts', 'syncQueue'];

            for (const storeName of stores) {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                await store.clear();
            }

            // Clear caches via service worker
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                if (registration.active) {
                    registration.active.postMessage({ type: 'CLEAR_CACHE' });
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to clear offline data:', error);
            return { success: false, error: error.message };
        }
    }

    // Get cached item count
    async getCachedCount(storeName) {
        try {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const count = await store.count();
            return count;
        } catch (error) {
            console.error('Failed to get count:', error);
            return 0;
        }
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `offline-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize offline manager
let offlineManager;
document.addEventListener('DOMContentLoaded', function() {
    offlineManager = new OfflineManager();
});

// Offline UI functions
async function downloadQuranForOffline() {
    if (!offlineManager) {
        alert('Offline manager yüklenmedi');
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';

    try {
        // Download all surahs
        for (let i = 1; i <= 114; i++) {
            await offlineManager.cacheQuranContent(i);
            const progress = ((i / 114) * 100).toFixed(0);
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${progress}%`;
        }

        btn.innerHTML = '<i class="fas fa-check"></i> Tamamlandı';
        offlineManager.showNotification('Kuran indirildi', 'Tüm sureler offline kullanım için hazır', 'success');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Kuran\'ı İndir';
        }, 3000);
        
        updateOfflineStats();
    } catch (error) {
        btn.innerHTML = '<i class="fas fa-times"></i> Hata';
        offlineManager.showNotification('İndirme başarısız', error.message, 'error');
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Kuran\'ı İndir';
        }, 3000);
    }
}

async function downloadHadithsForOffline() {
    if (!offlineManager) {
        alert('Offline manager yüklenmedi');
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';

    try {
        const sources = ['Buhari', 'Muslim', 'EbuDavud', 'Tirmizi', 'Nesai', 'IbnMace'];
        let total = 0;

        for (const source of sources) {
            const result = await offlineManager.cacheHadithContent(source, 200);
            total += result.count;
        }

        btn.innerHTML = '<i class="fas fa-check"></i> Tamamlandı';
        offlineManager.showNotification('Hadisler indirildi', `${total} hadis offline kullanım için hazır`, 'success');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Hadisleri İndir';
        }, 3000);
        
        updateOfflineStats();
    } catch (error) {
        btn.innerHTML = '<i class="fas fa-times"></i> Hata';
        offlineManager.showNotification('İndirme başarısız', error.message, 'error');
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Hadisleri İndir';
        }, 3000);
    }
}

async function downloadDuasForOffline() {
    if (!offlineManager) {
        alert('Offline manager yüklenmedi');
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';

    try {
        const result = await offlineManager.cacheDuaContent();
        
        btn.innerHTML = '<i class="fas fa-check"></i> Tamamlandı';
        offlineManager.showNotification('Dualar indirildi', `${result.count} dua offline kullanım için hazır`, 'success');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Duaları İndir';
        }, 3000);
        
        updateOfflineStats();
    } catch (error) {
        btn.innerHTML = '<i class="fas fa-times"></i> Hata';
        offlineManager.showNotification('İndirme başarısız', error.message, 'error');
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Duaları İndir';
        }, 3000);
    }
}

async function clearAllOfflineData() {
    if (!offlineManager) {
        alert('Offline manager yüklenmedi');
        return;
    }

    if (!confirm('Tüm offline veriler silinecek. Emin misiniz?')) {
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Temizleniyor...';

    try {
        await offlineManager.clearOfflineData();
        
        btn.innerHTML = '<i class="fas fa-check"></i> Temizlendi';
        offlineManager.showNotification('Veriler temizlendi', 'Tüm offline veriler silindi', 'success');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-trash"></i> Tüm Verileri Temizle';
        }, 3000);
        
        updateOfflineStats();
    } catch (error) {
        btn.innerHTML = '<i class="fas fa-times"></i> Hata';
        offlineManager.showNotification('Temizleme başarısız', error.message, 'error');
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-trash"></i> Tüm Verileri Temizle';
        }, 3000);
    }
}

async function updateOfflineStats() {
    if (!offlineManager) return;

    const quranCount = await offlineManager.getCachedCount('quran');
    const hadithCount = await offlineManager.getCachedCount('hadiths');
    const duaCount = await offlineManager.getCachedCount('duas');
    const storageInfo = await offlineManager.getStorageInfo();

    const statsElement = document.getElementById('offlineStats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-book-quran"></i>
                <div>
                    <div class="stat-value">${quranCount}</div>
                    <div class="stat-label">Kuran Sure</div>
                </div>
            </div>
            <div class="stat-item">
                <i class="fas fa-scroll"></i>
                <div>
                    <div class="stat-value">${hadithCount}</div>
                    <div class="stat-label">Hadis</div>
                </div>
            </div>
            <div class="stat-item">
                <i class="fas fa-hands-praying"></i>
                <div>
                    <div class="stat-value">${duaCount}</div>
                    <div class="stat-label">Dua</div>
                </div>
            </div>
            ${storageInfo ? `
            <div class="stat-item">
                <i class="fas fa-database"></i>
                <div>
                    <div class="stat-value">${storageInfo.usageInMB} MB</div>
                    <div class="stat-label">Kullanılan Alan</div>
                </div>
            </div>
            ` : ''}
        `;
    }
}
