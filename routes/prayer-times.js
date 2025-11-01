const express = require('express');
const router = express.Router();
const axios = require('axios');

// Türkiye şehirleri koordinatları
const turkishCities = {
  'Istanbul': { lat: 41.0082, lon: 28.9784 },
  'Ankara': { lat: 39.9334, lon: 32.8597 },
  'Izmir': { lat: 38.4192, lon: 27.1287 },
  'Bursa': { lat: 40.1826, lon: 29.0665 },
  'Antalya': { lat: 36.8969, lon: 30.7133 },
  'Konya': { lat: 37.8746, lon: 32.4932 },
  'Adana': { lat: 37.0000, lon: 35.3213 }
};

// Namaz vakitleri sayfası
router.get('/', async (req, res) => {
  try {
    const selectedCity = req.query.city || 'Istanbul';
    const cityCoords = turkishCities[selectedCity];
    
    // Aladhan API'den namaz vakitlerini çek
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const apiUrl = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${cityCoords.lat}&longitude=${cityCoords.lon}&method=13`;
    
    const response = await axios.get(apiUrl);
    const timings = response.data.data.timings;
    
    res.render('prayer-times/index', {
      selectedCity,
      prayerTimes: {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      },
      date: response.data.data.date.readable,
      hijriDate: response.data.data.date.hijri.date
    });
  } catch (error) {
    console.error('Namaz vakitleri hatası:', error);
    // Hata durumunda varsayılan saatler
    res.render('prayer-times/index', {
      selectedCity: 'Istanbul',
      prayerTimes: {
        fajr: '05:30',
        sunrise: '07:15',
        dhuhr: '13:05',
        asr: '15:45',
        maghrib: '18:20',
        isha: '19:55'
      },
      date: new Date().toLocaleDateString('tr-TR'),
      hijriDate: ''
    });
  }
});

// API endpoint - JSON formatında namaz vakitleri
router.get('/api/times/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const cityCoords = turkishCities[city];
    
    if (!cityCoords) {
      return res.status(404).json({ error: 'Şehir bulunamadı' });
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const apiUrl = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${cityCoords.lat}&longitude=${cityCoords.lon}&method=13`;
    
    const response = await axios.get(apiUrl);
    const timings = response.data.data.timings;
    
    res.json({
      city,
      date: response.data.data.date.readable,
      hijriDate: response.data.data.date.hijri.date,
      times: {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Namaz vakitleri alınamadı' });
  }
});

// Kıble yönü hesaplama
router.post('/api/qibla', (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // Kabe koordinatları
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;
    
    // Kıble açısını hesapla
    const toRad = (deg) => deg * Math.PI / 180;
    const toDeg = (rad) => rad * 180 / Math.PI;
    
    const dLon = toRad(kaabaLon - longitude);
    const y = Math.sin(dLon) * Math.cos(toRad(kaabaLat));
    const x = Math.cos(toRad(latitude)) * Math.sin(toRad(kaabaLat)) -
              Math.sin(toRad(latitude)) * Math.cos(toRad(kaabaLat)) * Math.cos(dLon);
    
    let angle = toDeg(Math.atan2(y, x));
    angle = (angle + 360) % 360;
    
    res.json({ qiblaAngle: angle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kıble açısı hesaplanamadı' });
  }
});

// Kıble pusulası sayfası
router.get('/qibla', (req, res) => {
  res.render('prayer-times/qibla', {
    title: 'Kıble Pusulası'
  });
});

// Bildirim ayarları sayfası
router.get('/notifications', (req, res) => {
  res.render('prayer-times/notifications', {
    title: 'Namaz Vakti Bildirimleri',
    cities: Object.keys(turkishCities)
  });
});

module.exports = router;
