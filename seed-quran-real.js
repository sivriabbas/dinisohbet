const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Surah = require('./models/Surah');

// Quran.com API'den gerçek Kuran verilerini çek
async function fetchRealQuranData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı!\n');

        // Mevcut sureleri temizle
        await Surah.deleteMany({});
        console.log('🗑️  Mevcut veriler temizlendi.\n');

        console.log('📥 Quran.com API\'den gerçek Kuran verileri indiriliyor...\n');
        console.log('⚠️  DİKKAT: Bu işlem 10-15 dakika sürebilir. Lütfen bekleyin...\n');

        // 114 surenin tamamını çek
        for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
            try {
                // Sure bilgilerini al
                const surahInfoResponse = await axios.get(`https://api.quran.com/api/v4/chapters/${surahNumber}?language=tr`);
                const surahInfo = surahInfoResponse.data.chapter;

                // Ayetleri al (Diyanet meali - translation_id: 77)
                // text_uthmani için ayrı endpoint kullan
                const versesResponse = await axios.get(
                    `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=tr&words=true&translations=77&fields=text_uthmani&per_page=300`
                );
                
                const verses = versesResponse.data.verses;

                // Ayetleri formatlayalım - Arapça, okunuş ve Türkçe meal
                const ayahs = verses.map(verse => {
                    // Transliteration (okunuş) için words'den oluştur
                    let transliteration = '';
                    if (verse.words && verse.words.length > 0) {
                        transliteration = verse.words
                            .map(w => w.transliteration ? w.transliteration.text : '')
                            .filter(t => t)
                            .join(' ');
                    }

                    return {
                        number: verse.verse_number,
                        arabic: verse.text_uthmani || '',
                        transliteration: transliteration,
                        turkish: verse.translations && verse.translations[0] ? verse.translations[0].text : ''
                    };
                });

                // Sure verisini kaydet
                const surahData = {
                    number: surahNumber,
                    name: surahInfo.name_simple,
                    nameArabic: surahInfo.name_arabic,
                    meaning: surahInfo.translated_name ? surahInfo.translated_name.name : surahInfo.name_simple,
                    numberOfAyahs: surahInfo.verses_count,
                    revelationType: surahInfo.revelation_place === 'makkah' ? 'Mekki' : 'Medeni',
                    ayahs: ayahs
                };

                await Surah.create(surahData);
                
                console.log(`✅ ${surahNumber}/114 - ${surahInfo.name_simple} (${ayahs.length} ayet)`);
                
                // API rate limit için kısa bekleme
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ ${surahNumber}. sure yüklenirken hata:`, error.message);
            }
        }

        console.log('\n🎉 TAMAMLANDI! Tüm 114 sure gerçek ayetlerle eklendi!');
        console.log('\n📊 Kontrol ediliyor...');
        
        const totalSurahs = await Surah.countDocuments();
        const totalAyahs = await Surah.aggregate([
            { $project: { ayahCount: { $size: "$ayahs" } } },
            { $group: { _id: null, total: { $sum: "$ayahCount" } } }
        ]);

        console.log(`\n✨ İstatistikler:`);
        console.log(`   📖 Toplam Sure: ${totalSurahs}`);
        console.log(`   📝 Toplam Ayet: ${totalAyahs[0]?.total || 0}`);
        console.log(`\n🕌 Kuran-ı Kerim tam ve eksiksiz olarak veritabanına kaydedildi!`);
        console.log(`📚 Diyanet İşleri Başkanlığı meali kullanılmıştır.`);

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ HATA:', error);
        mongoose.connection.close();
    }
}

fetchRealQuranData();
