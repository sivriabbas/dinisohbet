// Push Notification Manager
class PushNotificationManager {
    constructor() {
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    }
    
    async requestPermission() {
        if (!this.isSupported) {
            console.warn('Push notifications not supported');
            return false;
        }
        
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    async subscribe() {
        if (!this.isSupported) return null;
        
        try {
            const registration = await navigator.serviceWorker.ready;
            
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
                )
            });
            
            // Sunucuya abonelik bilgisini gönder
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
            
            return subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return null;
        }
    }
    
    async sendNotification(title, options) {
        if (!this.isSupported) return;
        
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
            icon: '/images/icon-192x192.png',
            badge: '/images/badge-72x72.png',
            vibrate: [200, 100, 200],
            ...options
        });
    }
    
    async schedulePrayerNotifications(prayerTimes) {
        // Namaz vakti bildirimlerini planla
        const now = new Date();
        
        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            const [hours, minutes] = time.split(':');
            const prayerTime = new Date();
            prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);
            
            if (prayerTime > now) {
                const delay = prayerTime - now;
                setTimeout(() => {
                    this.sendNotification('Namaz Vakti', {
                        body: `${prayer} namazı vakti girdi`,
                        tag: `prayer-${prayer}`,
                        requireInteraction: true
                    });
                }, delay);
            }
        });
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Initialize
const pushManager = new PushNotificationManager();

// Export for global use
window.pushManager = pushManager;
