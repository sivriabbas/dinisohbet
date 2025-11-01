// Qibla Compass Application
class QiblaCompass {
    constructor() {
        this.userLat = null;
        this.userLon = null;
        this.qiblaAngle = null;
        this.currentHeading = 0;
        this.map = null;
        
        // Kabe koordinatları
        this.kaabaLat = 21.4225;
        this.kaabaLon = 39.8262;
        
        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        this.locationPrompt = document.getElementById('location-prompt');
        this.loadingState = document.getElementById('loading-state');
        this.compassContainer = document.getElementById('compass-container');
        this.mapSection = document.getElementById('map-section');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        
        this.requestLocationBtn = document.getElementById('request-location-btn');
        this.retryBtn = document.getElementById('retry-btn');
        
        this.compassRose = document.getElementById('compass-rose');
        this.qiblaArrow = document.getElementById('qibla-arrow');
        this.qiblaAngleDisplay = document.getElementById('qibla-angle');
        this.userLocationDisplay = document.getElementById('user-location');
        this.distanceDisplay = document.getElementById('distance-to-kaaba');
        this.orientationWarning = document.getElementById('orientation-warning');
    }

    attachEventListeners() {
        this.requestLocationBtn.addEventListener('click', () => {
            this.requestLocation();
        });

        this.retryBtn.addEventListener('click', () => {
            this.hideError();
            this.requestLocation();
        });
    }

    async requestLocation() {
        if (!navigator.geolocation) {
            this.showError('Tarayıcınız konum özelliğini desteklemiyor.');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            (position) => this.onLocationSuccess(position),
            (error) => this.onLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    async onLocationSuccess(position) {
        this.userLat = position.coords.latitude;
        this.userLon = position.coords.longitude;

        try {
            // Kıble açısını hesapla
            await this.calculateQibla();
            
            // Konum adını al
            await this.getReverseGeocode();
            
            // Mesafeyi hesapla
            this.calculateDistance();
            
            // UI'yi göster
            this.showCompass();
            
            // Haritayı başlat
            this.initMap();
            
            // Cihaz yönünü dinle
            this.startOrientationTracking();
            
        } catch (error) {
            console.error('Qibla calculation error:', error);
            this.showError('Kıble açısı hesaplanırken bir hata oluştu.');
        }
    }

    onLocationError(error) {
        let message = 'Konumunuz alınamadı.';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından konum iznini etkinleştirin.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Konum bilgisi mevcut değil.';
                break;
            case error.TIMEOUT:
                message = 'Konum alma işlemi zaman aşımına uğradı.';
                break;
        }
        
        this.showError(message);
    }

    async calculateQibla() {
        try {
            const response = await fetch('/prayer-times/api/qibla', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    latitude: this.userLat,
                    longitude: this.userLon
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            this.qiblaAngle = data.qiblaAngle;
            
            // Açıyı göster
            this.qiblaAngleDisplay.textContent = Math.round(this.qiblaAngle) + '°';
            
        } catch (error) {
            throw error;
        }
    }

    async getReverseGeocode() {
        try {
            // Nominatim API ile konum adını al
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.userLat}&lon=${this.userLon}&zoom=10`
            );
            
            if (response.ok) {
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || 'Bilinmiyor';
                const country = data.address.country || '';
                this.userLocationDisplay.textContent = `${city}, ${country}`;
            } else {
                this.userLocationDisplay.textContent = `${this.userLat.toFixed(4)}, ${this.userLon.toFixed(4)}`;
            }
        } catch (error) {
            this.userLocationDisplay.textContent = `${this.userLat.toFixed(4)}, ${this.userLon.toFixed(4)}`;
        }
    }

    calculateDistance() {
        // Haversine formülü ile mesafe hesapla
        const R = 6371; // Dünya'nın yarıçapı (km)
        const dLat = this.toRad(this.kaabaLat - this.userLat);
        const dLon = this.toRad(this.kaabaLon - this.userLon);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(this.userLat)) * Math.cos(this.toRad(this.kaabaLat)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        this.distanceDisplay.textContent = Math.round(distance).toLocaleString('tr-TR') + ' km';
    }

    startOrientationTracking() {
        if ('DeviceOrientationEvent' in window) {
            // iOS 13+ için izin kontrolü
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permission => {
                        if (permission === 'granted') {
                            this.enableOrientation();
                        } else {
                            this.showOrientationWarning();
                        }
                    })
                    .catch(console.error);
            } else {
                // Android ve eski iOS
                this.enableOrientation();
            }
        } else {
            this.showOrientationWarning();
        }
    }

    enableOrientation() {
        window.addEventListener('deviceorientationabsolute', (event) => {
            this.handleOrientation(event.alpha);
        }, true);

        window.addEventListener('deviceorientation', (event) => {
            if (event.absolute && event.alpha !== null) {
                this.handleOrientation(event.alpha);
            }
        }, true);
    }

    handleOrientation(alpha) {
        if (alpha === null) return;
        
        // Cihaz yönü (kuzeyden saat yönünde derece)
        this.currentHeading = alpha;
        
        // Pusulayı döndür
        this.compassRose.style.transform = `rotate(${-alpha}deg)`;
        
        // Kıble okunu döndür (kıble açısı - cihaz yönü)
        const qiblaRotation = this.qiblaAngle - alpha;
        this.qiblaArrow.style.transform = `translate(-50%, -50%) rotate(${qiblaRotation}deg)`;
    }

    showOrientationWarning() {
        this.orientationWarning.style.display = 'flex';
    }

    initMap() {
        // Leaflet haritasını başlat
        this.map = L.map('qibla-map').setView([this.userLat, this.userLon], 5);
        
        // OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Kullanıcı konumu işaretçisi
        const userIcon = L.divIcon({
            className: 'custom-marker',
            html: '<i class="fas fa-map-pin" style="color: #dc3545; font-size: 2rem;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        
        L.marker([this.userLat, this.userLon], { icon: userIcon })
            .addTo(this.map)
            .bindPopup('<b>Konumunuz</b>');
        
        // Kabe konumu işaretçisi
        const kaabaIcon = L.divIcon({
            className: 'custom-marker',
            html: '<i class="fas fa-kaaba" style="color: #28a745; font-size: 2rem;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        
        L.marker([this.kaabaLat, this.kaabaLon], { icon: kaabaIcon })
            .addTo(this.map)
            .bindPopup('<b>Kabe - Mekke</b>');
        
        // Kıble yönü çizgisi
        const latlngs = [
            [this.userLat, this.userLon],
            [this.kaabaLat, this.kaabaLon]
        ];
        
        L.polyline(latlngs, {
            color: '#6366f1',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);
        
        // Haritayı her iki noktayı içerecek şekilde ayarla
        const bounds = L.latLngBounds([
            [this.userLat, this.userLon],
            [this.kaabaLat, this.kaabaLon]
        ]);
        this.map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Helper functions
    toRad(deg) {
        return deg * Math.PI / 180;
    }

    toDeg(rad) {
        return rad * 180 / Math.PI;
    }

    // UI State Management
    showLoading() {
        this.locationPrompt.style.display = 'none';
        this.loadingState.style.display = 'block';
        this.compassContainer.style.display = 'none';
        this.mapSection.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    showCompass() {
        this.locationPrompt.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.compassContainer.style.display = 'block';
        this.mapSection.style.display = 'block';
        this.errorMessage.style.display = 'none';
    }

    showError(message) {
        this.locationPrompt.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.compassContainer.style.display = 'none';
        this.mapSection.style.display = 'none';
        this.errorMessage.style.display = 'block';
        this.errorText.textContent = message;
    }

    hideError() {
        this.errorMessage.style.display = 'none';
        this.locationPrompt.style.display = 'block';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const qiblaCompass = new QiblaCompass();
});
