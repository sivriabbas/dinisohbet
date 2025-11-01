require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Rozet verileri
const achievements = [
  // Streak (Seri) Rozetleri
  {
    name: 'İlk Adım',
    description: '3 gün üst üste hedeflerinizi tamamlayın',
    icon: 'fas fa-fire',
    category: 'streak',
    requirement: 3,
    requirementType: 'streak',
    color: '#FF6B6B',
    points: 10,
    rarity: 'common'
  },
  {
    name: 'Kararlı',
    description: '7 gün üst üste hedeflerinizi tamamlayın',
    icon: 'fas fa-fire-flame-curved',
    category: 'streak',
    requirement: 7,
    requirementType: 'streak',
    color: '#FF8E53',
    points: 25,
    rarity: 'rare'
  },
  {
    name: 'Azimli',
    description: '30 gün üst üste hedeflerinizi tamamlayın',
    icon: 'fas fa-fire-flame-simple',
    category: 'streak',
    requirement: 30,
    requirementType: 'streak',
    color: '#FFD93D',
    points: 100,
    rarity: 'epic'
  },
  {
    name: 'Efsane',
    description: '100 gün üst üste hedeflerinizi tamamlayın',
    icon: 'fas fa-crown',
    category: 'streak',
    requirement: 100,
    requirementType: 'streak',
    color: '#FFD700',
    points: 500,
    rarity: 'legendary'
  },

  // Kuran Rozetleri
  {
    name: 'Kuran Öğrencisi',
    description: '100 ayet okuyun',
    icon: 'fas fa-book-quran',
    category: 'quran',
    requirement: 100,
    requirementType: 'total_ayahs',
    color: '#667eea',
    points: 20,
    rarity: 'common'
  },
  {
    name: 'Kuran Âşığı',
    description: '500 ayet okuyun',
    icon: 'fas fa-book-open-reader',
    category: 'quran',
    requirement: 500,
    requirementType: 'total_ayahs',
    color: '#764ba2',
    points: 50,
    rarity: 'rare'
  },
  {
    name: 'Hafız Adayı',
    description: '1000 ayet okuyun',
    icon: 'fas fa-star-and-crescent',
    category: 'quran',
    requirement: 1000,
    requirementType: 'total_ayahs',
    color: '#4facfe',
    points: 150,
    rarity: 'epic'
  },
  {
    name: 'Hatim Kahramanı',
    description: 'Tüm Kuran\'ı okuyun (6236 ayet)',
    icon: 'fas fa-gem',
    category: 'quran',
    requirement: 6236,
    requirementType: 'total_ayahs',
    color: '#00f2fe',
    points: 1000,
    rarity: 'legendary'
  },

  // Hadis Rozetleri
  {
    name: 'Hadis Öğrencisi',
    description: '10 hadis okuyun',
    icon: 'fas fa-scroll',
    category: 'hadith',
    requirement: 10,
    requirementType: 'total_hadiths',
    color: '#f093fb',
    points: 15,
    rarity: 'common'
  },
  {
    name: 'Hadis Bilgini',
    description: '50 hadis okuyun',
    icon: 'fas fa-book-bookmark',
    category: 'hadith',
    requirement: 50,
    requirementType: 'total_hadiths',
    color: '#f5576c',
    points: 40,
    rarity: 'rare'
  },
  {
    name: 'Hadis Âlimi',
    description: '100 hadis okuyun',
    icon: 'fas fa-graduation-cap',
    category: 'hadith',
    requirement: 100,
    requirementType: 'total_hadiths',
    color: '#e91e63',
    points: 100,
    rarity: 'epic'
  },

  // Dua Rozetleri
  {
    name: 'Dua Eden',
    description: '20 dua okuyun',
    icon: 'fas fa-hands-praying',
    category: 'dua',
    requirement: 20,
    requirementType: 'total_duas',
    color: '#43e97b',
    points: 15,
    rarity: 'common'
  },
  {
    name: 'Dua Ustası',
    description: '50 dua okuyun',
    icon: 'fas fa-heart',
    category: 'dua',
    requirement: 50,
    requirementType: 'total_duas',
    color: '#38f9d7',
    points: 40,
    rarity: 'rare'
  },

  // Hedef Tamamlama Rozetleri
  {
    name: 'Hedef Odaklı',
    description: '5 hedef tamamlayın',
    icon: 'fas fa-bullseye',
    category: 'general',
    requirement: 5,
    requirementType: 'goals_completed',
    color: '#f39c12',
    points: 20,
    rarity: 'common'
  },
  {
    name: 'Başarı Avcısı',
    description: '25 hedef tamamlayın',
    icon: 'fas fa-trophy',
    category: 'general',
    requirement: 25,
    requirementType: 'goals_completed',
    color: '#e67e22',
    points: 75,
    rarity: 'rare'
  },
  {
    name: 'Hedef Şampiyonu',
    description: '100 hedef tamamlayın',
    icon: 'fas fa-medal',
    category: 'general',
    requirement: 100,
    requirementType: 'goals_completed',
    color: '#d35400',
    points: 250,
    rarity: 'epic'
  }
];

async function seedAchievements() {
  try {
    // Mevcut rozetleri temizle
    await Achievement.deleteMany({});
    console.log('Mevcut rozetler temizlendi');

    // Yeni rozetleri ekle
    await Achievement.insertMany(achievements);
    console.log(`\n✅ ${achievements.length} rozet başarıyla eklendi!`);

    // Kategorilere göre istatistik
    const categories = await Achievement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Kategori bazında rozet istatistikleri:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} rozet, ${cat.totalPoints} puan`);
    });

    // Nadirliklere göre istatistik
    const rarities = await Achievement.aggregate([
      {
        $group: {
          _id: '$rarity',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🌟 Nadirlik bazında rozet istatistikleri:');
    rarities.forEach(rar => {
      console.log(`${rar._id}: ${rar.count} rozet`);
    });

    console.log('\n💡 Rozet sistemi hazır!');
    console.log('Test için: http://localhost:3002/goals');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
seedAchievements();
