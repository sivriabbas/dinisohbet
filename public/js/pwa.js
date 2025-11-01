// PWA Registration and Installation
(function() {
    'use strict';

    // Service Worker desteği kontrolü
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            registerServiceWorker();
        });
    }

    // Service Worker kaydı
    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('✅ Service Worker registered:', registration.scope);

            // Güncelleme kontrolü
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Service Worker update found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Yeni versiyon mevcut - kullanıcıya bildir
                        showUpdateNotification();
                    }
                });
            });

            // Periyodik güncelleme kontrolü (her saat)
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);

        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }

    // Güncelleme bildirimi göster
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>🎉 Yeni bir versiyon mevcut!</p>
                <button onclick="window.location.reload()">Güncelle</button>
                <button onclick="this.parentElement.parentElement.remove()">Daha Sonra</button>
            </div>
        `;
        document.body.appendChild(notification);
    }

    // Install prompt yakalama
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💡 Install prompt available');
        
        // Varsayılan install prompt'u engelle
        e.preventDefault();
        deferredPrompt = e;

        // Install butonunu göster
        showInstallButton();
    });

    // Install butonu göster
    function showInstallButton() {
        const installButton = document.getElementById('pwa-install-btn');
        if (installButton) {
            installButton.style.display = 'flex';
            
            installButton.addEventListener('click', async () => {
                if (!deferredPrompt) {
                    return;
                }

                // Install prompt'u göster
                deferredPrompt.prompt();

                // Kullanıcının seçimini bekle
                const { outcome } = await deferredPrompt.userChoice;
                
                console.log(`User choice: ${outcome}`);

                if (outcome === 'accepted') {
                    console.log('✅ PWA installed');
                    showInstallSuccess();
                }

                // Prompt'u temizle
                deferredPrompt = null;
                installButton.style.display = 'none';
            });
        }
    }

    // Kurulum başarı mesajı
    function showInstallSuccess() {
        const message = document.createElement('div');
        message.className = 'install-success';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <p>Uygulama başarıyla kuruldu!</p>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Uygulama kurulduğunda
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA was installed');
        deferredPrompt = null;
        
        // Analytics'e gönder (varsa)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_installed', {
                event_category: 'engagement',
                event_label: 'PWA Installation'
            });
        }
    });

    // Standalone mode kontrolü
    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Standalone modda çalışıyorsa
    if (isStandalone()) {
        console.log('📱 Running in standalone mode');
        document.body.classList.add('standalone-mode');
    }

    // Online/Offline durumu izle
    window.addEventListener('online', () => {
        console.log('🌐 Back online');
        showConnectionStatus('Online', 'success');
        
        // Service Worker'a sync mesajı gönder
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: 'sync-data'
            });
        }
    });

    window.addEventListener('offline', () => {
        console.log('📡 Gone offline');
        showConnectionStatus('Offline - Çevrimdışı Mod', 'error');
    });

    // Bağlantı durumu bildirimi
    function showConnectionStatus(message, type) {
        const notification = document.createElement('div');
        notification.className = `connection-status ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Push notification izni iste
    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('❌ This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Notification izin butonunu ayarla
    window.enableNotifications = async function() {
        const granted = await requestNotificationPermission();
        
        if (granted) {
            console.log('✅ Notifications enabled');
            
            // Service Worker'dan push subscription al
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY_HERE')
            });
            
            console.log('Push subscription:', subscription);
            
            // Subscription'ı sunucuya gönder
            await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
        }
    };

    // VAPID key dönüştürücü
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Global olarak erişilebilir fonksiyonlar
    window.PWA = {
        requestNotificationPermission,
        isStandalone
    };

})();
