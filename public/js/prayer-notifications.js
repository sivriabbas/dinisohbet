// Prayer Time Notifications Manager
class PrayerNotifications {
    constructor() {
        this.settings = this.loadSettings();
        this.prayerTimes = {};
        this.checkInterval = null;
        this.audio = new Audio('/sounds/adhan.mp3');
        
        this.initElements();
        this.checkNotificationPermission();
        this.attachEventListeners();
        this.loadPrayerTimes();
    }

    initElements() {
        this.permissionStatus = document.getElementById('permission-status');
        this.notificationSettings = document.getElementById('notification-settings');
        this.notificationsDisabled = document.getElementById('notifications-disabled');
        
        this.citySelect = document.getElementById('city-select');
        this.notificationBefore = document.getElementById('notification-before');
        this.playAdhan = document.getElementById('play-adhan');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');
        
        this.saveBtn = document.getElementById('save-settings-btn');
        this.testSoundBtn = document.getElementById('test-sound-btn');
        this.testNotificationBtn = document.getElementById('test-notification-btn');
        this.requestPermissionBtn = document.getElementById('request-permission-btn');
        
        // Prayer time checkboxes
        this.notifyCheckboxes = {
            fajr: document.getElementById('notify-fajr'),
            sunrise: document.getElementById('notify-sunrise'),
            dhuhr: document.getElementById('notify-dhuhr'),
            asr: document.getElementById('notify-asr'),
            maghrib: document.getElementById('notify-maghrib'),
            isha: document.getElementById('notify-isha')
        };
        
        // Prayer time displays
        this.timeDisplays = {
            fajr: document.getElementById('time-fajr'),
            sunrise: document.getElementById('time-sunrise'),
            dhuhr: document.getElementById('time-dhuhr'),
            asr: document.getElementById('time-asr'),
            maghrib: document.getElementById('time-maghrib'),
            isha: document.getElementById('time-isha')
        };
    }

    attachEventListeners() {
        // City selection
        this.citySelect.addEventListener('change', () => {
            this.loadPrayerTimes();
        });

        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.volumeValue.textContent = value + '%';
            this.audio.volume = value / 100;
        });

        // Save settings
        this.saveBtn.addEventListener('click', () => {
            this.saveSettings();
        });

        // Test sound
        this.testSoundBtn.addEventListener('click', () => {
            this.playAdhanSound();
        });

        // Test notification
        this.testNotificationBtn.addEventListener('click', () => {
            this.sendTestNotification();
        });

        // Request permission
        this.requestPermissionBtn.addEventListener('click', () => {
            this.requestNotificationPermission();
        });
    }

    async checkNotificationPermission() {
        if (!('Notification' in window)) {
            this.showNotificationsDisabled();
            return;
        }

        const permission = Notification.permission;
        
        if (permission === 'granted') {
            this.showPermissionGranted();
            this.showSettings();
        } else if (permission === 'denied') {
            this.showPermissionDenied();
        } else {
            this.showPermissionDefault();
        }
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.showPermissionGranted();
                this.showSettings();
                this.sendTestNotification();
            } else {
                this.showPermissionDenied();
            }
        } catch (error) {
            console.error('Permission request error:', error);
            this.showNotificationsDisabled();
        }
    }

    async loadPrayerTimes() {
        const city = this.citySelect.value;
        
        try {
            const response = await fetch(`/prayer-times/api/times/${city}`);
            if (!response.ok) throw new Error('Failed to fetch prayer times');
            
            const data = await response.json();
            this.prayerTimes = data.times;
            
            // Update time displays
            this.timeDisplays.fajr.textContent = data.times.fajr;
            this.timeDisplays.sunrise.textContent = data.times.sunrise;
            this.timeDisplays.dhuhr.textContent = data.times.dhuhr;
            this.timeDisplays.asr.textContent = data.times.asr;
            this.timeDisplays.maghrib.textContent = data.times.maghrib;
            this.timeDisplays.isha.textContent = data.times.isha;
            
        } catch (error) {
            console.error('Prayer times error:', error);
        }
    }

    saveSettings() {
        const settings = {
            city: this.citySelect.value,
            notificationBefore: parseInt(this.notificationBefore.value),
            playAdhan: this.playAdhan.checked,
            volume: parseInt(this.volumeSlider.value),
            notifications: {
                fajr: this.notifyCheckboxes.fajr.checked,
                sunrise: this.notifyCheckboxes.sunrise.checked,
                dhuhr: this.notifyCheckboxes.dhuhr.checked,
                asr: this.notifyCheckboxes.asr.checked,
                maghrib: this.notifyCheckboxes.maghrib.checked,
                isha: this.notifyCheckboxes.isha.checked
            }
        };

        localStorage.setItem('prayerNotificationSettings', JSON.stringify(settings));
        
        // Start checking for prayer times
        this.startNotificationChecker();
        
        // Show success message
        this.showSuccessMessage();
    }

    loadSettings() {
        const saved = localStorage.getItem('prayerNotificationSettings');
        
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Apply saved settings to UI
            if (this.citySelect) this.citySelect.value = settings.city || 'Istanbul';
            if (this.notificationBefore) this.notificationBefore.value = settings.notificationBefore || 0;
            if (this.playAdhan) this.playAdhan.checked = settings.playAdhan !== false;
            if (this.volumeSlider) {
                this.volumeSlider.value = settings.volume || 50;
                this.volumeValue.textContent = (settings.volume || 50) + '%';
                this.audio.volume = (settings.volume || 50) / 100;
            }
            
            // Apply notification toggles
            if (settings.notifications) {
                Object.keys(settings.notifications).forEach(prayer => {
                    if (this.notifyCheckboxes[prayer]) {
                        this.notifyCheckboxes[prayer].checked = settings.notifications[prayer];
                    }
                });
            }
            
            return settings;
        }
        
        return {
            city: 'Istanbul',
            notificationBefore: 0,
            playAdhan: true,
            volume: 50,
            notifications: {
                fajr: true,
                sunrise: false,
                dhuhr: true,
                asr: true,
                maghrib: true,
                isha: true
            }
        };
    }

    startNotificationChecker() {
        // Stop existing checker
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check every minute
        this.checkInterval = setInterval(() => {
            this.checkPrayerTimes();
        }, 60000); // 60 seconds

        // Also check immediately
        this.checkPrayerTimes();
    }

    checkPrayerTimes() {
        const now = new Date();
        const currentTime = this.formatTime(now);
        const settings = this.loadSettings();
        
        const prayerNames = {
            fajr: 'İmsak',
            sunrise: 'Güneş',
            dhuhr: 'Öğle',
            asr: 'İkindi',
            maghrib: 'Akşam',
            isha: 'Yatsı'
        };

        Object.keys(this.prayerTimes).forEach(prayer => {
            if (!settings.notifications[prayer]) return;
            
            const prayerTime = this.prayerTimes[prayer];
            const notifyTime = this.calculateNotificationTime(prayerTime, settings.notificationBefore);
            
            // Check if it's time to notify
            if (currentTime === notifyTime) {
                const storageKey = `notified_${prayer}_${prayerTime}`;
                
                // Check if we already notified for this time today
                if (!sessionStorage.getItem(storageKey)) {
                    this.sendPrayerNotification(prayerNames[prayer], prayerTime);
                    sessionStorage.setItem(storageKey, 'true');
                }
            }
        });
    }

    calculateNotificationTime(prayerTime, minutesBefore) {
        const [hours, minutes] = prayerTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes - minutesBefore);
        return this.formatTime(date);
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    sendPrayerNotification(prayerName, time) {
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(`${prayerName} Vakti Girdi`, {
            body: `Vakit saati: ${time}\nHaydi namaza!`,
            icon: '/images/icon-192x192.png',
            badge: '/images/icon-72x72.png',
            tag: `prayer-${prayerName}`,
            requireInteraction: true,
            vibrate: [200, 100, 200]
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Play adhan if enabled
        const settings = this.loadSettings();
        if (settings.playAdhan) {
            this.playAdhanSound();
        }
    }

    sendTestNotification() {
        if (Notification.permission !== 'granted') {
            alert('Lütfen önce bildirim izni verin.');
            return;
        }

        const notification = new Notification('Test Bildirimi', {
            body: 'Bildirimler başarıyla çalışıyor! 🕌',
            icon: '/images/icon-192x192.png',
            tag: 'test'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    playAdhanSound() {
        this.audio.currentTime = 0;
        this.audio.play().catch(error => {
            console.error('Audio play error:', error);
            // Fallback: Show alert if audio fails
            alert('Ezan sesi çalınamadı. Tarayıcı ayarlarınızı kontrol edin.');
        });
    }

    // UI State Management
    showPermissionGranted() {
        this.permissionStatus.innerHTML = `
            <div class="status-card granted">
                <i class="fas fa-check-circle"></i>
                <h3>Bildirimler Aktif</h3>
                <p>Namaz vakitleri için bildirim alacaksınız.</p>
            </div>
        `;
    }

    showPermissionDenied() {
        this.permissionStatus.innerHTML = `
            <div class="status-card denied">
                <i class="fas fa-times-circle"></i>
                <h3>Bildirimler Reddedildi</h3>
                <p>Tarayıcı ayarlarından bildirimleri etkinleştirmeniz gerekiyor.</p>
            </div>
        `;
        this.notificationsDisabled.style.display = 'block';
    }

    showPermissionDefault() {
        this.permissionStatus.innerHTML = `
            <div class="status-card">
                <i class="fas fa-bell"></i>
                <h3>Bildirim İzni Gerekli</h3>
                <p>Namaz vakti bildirimleri için izin vermeniz gerekiyor.</p>
                <button id="request-permission-btn" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-bell"></i> İzin Ver
                </button>
            </div>
        `;
        
        // Re-attach event listener
        const btn = document.getElementById('request-permission-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.requestNotificationPermission();
            });
        }
    }

    showSettings() {
        this.notificationSettings.style.display = 'block';
        this.notificationsDisabled.style.display = 'none';
    }

    showNotificationsDisabled() {
        this.notificationsDisabled.style.display = 'block';
        this.notificationSettings.style.display = 'none';
        this.permissionStatus.innerHTML = '';
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Ayarlar kaydedildi! Bildirimler aktif.</span>
        `;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const prayerNotifications = new PrayerNotifications();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
