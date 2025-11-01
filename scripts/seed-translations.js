require('dotenv').config();
const mongoose = require('mongoose');
const Surah = require('../models/Surah');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Örnek meal verileri - Fatiha Suresi için
const fatihaTranslations = [
  {
    ayahNumber: 1,
    translations: {
      diyanet: "Rahmân ve Rahîm olan Allah'ın adıyla.",
      elmali: "Rahman ve Rahim olan Allah'ın ismiyle.",
      ates: "Çok merhametli ve daima bağışlayıcı olan Allah'ın adıyla.",
      yuksek: "Rahman ve Rahim olan Allah'ın adıyla (başlarım).",
      vakfi: "Sonsuz merhamet sahibi ve çok bağışlayıcı olan Allah'ın adıyla."
    }
  },
  {
    ayahNumber: 2,
    translations: {
      diyanet: "Hamd, âlemlerin Rabbi Allah'a mahsustur.",
      elmali: "Her türlü hamd ve övgü, âlemlerin rabbi Allah'a mahsustur.",
      ates: "Övgüler, varlıklar âleminin rabbi olan Allah'a mahsustur.",
      yuksek: "Hamd, âlemlerin Rabbi olan Allah içindir.",
      vakfi: "Her türlü övgü, âlemlerin Rabbi olan Allah'a özgüdür."
    }
  },
  {
    ayahNumber: 3,
    translations: {
      diyanet: "O, Rahmân'dır, Rahîm'dir.",
      elmali: "O, Rahman'dır, Rahim'dir.",
      ates: "O, pek merhametlidir, çok bağışlayıcıdır.",
      yuksek: "Rahman'dır, Rahim'dir.",
      vakfi: "Sonsuz merhamet sahibidir, çok bağışlayıcıdır."
    }
  },
  {
    ayahNumber: 4,
    translations: {
      diyanet: "Hesap ve ceza gününün sahibidir.",
      elmali: "Din (ceza ve mükâfat) gününün malikidir.",
      ates: "O, hesap ve ceza gününün tek hakimidir.",
      yuksek: "Ceza gününün malikidir.",
      vakfi: "Hesap ve karşılık gününün yegane hakimidir."
    }
  },
  {
    ayahNumber: 5,
    translations: {
      diyanet: "(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz.",
      elmali: "Yalnız sana ibadet eder ve yalnız senden yardım isteriz.",
      ates: "Yalnız sana kulluk eder ve yalnız senden yardım dileriz.",
      yuksek: "Ancak sana ibadet ederiz ve ancak senden yardım isteriz.",
      vakfi: "Yalnız sana ibadet eder, yalnız senden yardım dileriz."
    }
  },
  {
    ayahNumber: 6,
    translations: {
      diyanet: "Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet; gazaba uğrayanların ve sapıkların yoluna değil.",
      elmali: "Bizi dosdoğru yola ilet.",
      ates: "Bizi doğru yola ilet!",
      yuksek: "Bizi doğru yola ilet.",
      vakfi: "Bizi dosdoğru yola ilet!"
    }
  },
  {
    ayahNumber: 7,
    translations: {
      diyanet: "(Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet;) gazaba uğrayanların ve sapıkların yoluna değil.",
      elmali: "Kendilerine nimet verdiklerinin yoluna; gazaba uğramışların ve sapmışların yoluna değil.",
      ates: "Kendilerine lütuf ve ihsanda bulunduğun kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil!",
      yuksek: "Nimetine erdirdiklerinin yoluna; gazaba uğramışların ve sapmışların yoluna değil.",
      vakfi: "Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapıkların yoluna değil."
    }
  }
];

// İhlas Suresi mealleri
const ihlasTranslations = [
  {
    ayahNumber: 1,
    translations: {
      diyanet: "De ki: O, Allah'tır, bir tektir.",
      elmali: "De ki: O, Allah birdir.",
      ates: "De ki: 'O, Allah'tır, bir tektir.'",
      yuksek: "De ki: O, Allah birdir.",
      vakfi: "De ki: 'O Allah birdir.'"
    }
  },
  {
    ayahNumber: 2,
    translations: {
      diyanet: "Allah Samed'dir. (Her şey O'na muhtaçtır; O, hiçbir şeye muhtaç değildir.)",
      elmali: "Allah Samed'dir.",
      ates: "Allah Samed'dir (her şey O'na muhtaçtır; O, hiçbir şeye muhtaç değildir).",
      yuksek: "Allah Samed'dir (dilediğini yapandır, kendisinden başkasına muhtaç olmayandır).",
      vakfi: "Allah Samed'dir (her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir)."
    }
  },
  {
    ayahNumber: 3,
    translations: {
      diyanet: "O, doğurmamış ve doğmamıştır.",
      elmali: "Doğurmadı ve doğurulmadı.",
      ates: "O, doğurmamıştır ve doğmamıştır.",
      yuksek: "Doğurmadı ve doğurulmadı.",
      vakfi: "Doğurmamıştır ve doğmamıştır."
    }
  },
  {
    ayahNumber: 4,
    translations: {
      diyanet: "Hiçbir şey O'na denk ve benzer olmamıştır.",
      elmali: "Ve O'na denk olacak hiçbir şey yoktur.",
      ates: "Hiçbir şey O'na denk olmamıştır.",
      yuksek: "Ona denk hiçbir şey yoktur.",
      vakfi: "Hiçbir şey O'na denk ve benzer değildir."
    }
  }
];

async function seedTranslations() {
  try {
    // Fatiha Suresi'ni güncelle (Sure No: 1)
    console.log('\n📖 Fatiha Suresi meallerini güncelliyorum...');
    const fatiha = await Surah.findOne({ number: 1 });
    
    if (fatiha && fatiha.ayahs) {
      fatihaTranslations.forEach(trans => {
        const ayah = fatiha.ayahs.find(a => a.number === trans.ayahNumber);
        if (ayah) {
          ayah.translations = trans.translations;
        }
      });
      
      await fatiha.save();
      console.log('✅ Fatiha Suresi 7 ayet için 5 farklı meal eklendi');
    }

    // İhlas Suresi'ni güncelle (Sure No: 112)
    console.log('\n📖 İhlas Suresi meallerini güncelliyorum...');
    const ihlas = await Surah.findOne({ number: 112 });
    
    if (ihlas && ihlas.ayahs) {
      ihlasTranslations.forEach(trans => {
        const ayah = ihlas.ayahs.find(a => a.number === trans.ayahNumber);
        if (ayah) {
          ayah.translations = trans.translations;
        }
      });
      
      await ihlas.save();
      console.log('✅ İhlas Suresi 4 ayet için 5 farklı meal eklendi');
    }

    // Örnek olarak birkaç sure daha
    console.log('\n📖 Diğer surelere örnek mealler ekleniyor...');
    
    // Nas Suresi (114)
    const nas = await Surah.findOne({ number: 114 });
    if (nas && nas.ayahs) {
      nas.ayahs.forEach(ayah => {
        if (!ayah.translations) {
          ayah.translations = {
            diyanet: ayah.turkish || '',
            elmali: ayah.turkish || '',
            ates: ayah.turkish || '',
            yuksek: ayah.turkish || '',
            vakfi: ayah.turkish || ''
          };
        }
      });
      await nas.save();
      console.log('✅ Nas Suresi için mealler eklendi');
    }

    // Felak Suresi (113)
    const felak = await Surah.findOne({ number: 113 });
    if (felak && felak.ayahs) {
      felak.ayahs.forEach(ayah => {
        if (!ayah.translations) {
          ayah.translations = {
            diyanet: ayah.turkish || '',
            elmali: ayah.turkish || '',
            ates: ayah.turkish || '',
            yuksek: ayah.turkish || '',
            vakfi: ayah.turkish || ''
          };
        }
      });
      await felak.save();
      console.log('✅ Felak Suresi için mealler eklendi');
    }

    // İstatistikler
    console.log('\n📊 İstatistikler:');
    const totalSurahs = await Surah.countDocuments();
    console.log(`Toplam Sure: ${totalSurahs}`);
    
    const surahsWithTranslations = await Surah.find({ 'ayahs.translations': { $exists: true } });
    console.log(`Meal eklenmiş sureler: ${surahsWithTranslations.length}`);
    
    console.log('\n✅ Meal ekleme işlemi tamamlandı!');
    console.log('\n💡 Test için:');
    console.log('   - Fatiha Suresi: http://localhost:3002/quran/1');
    console.log('   - İhlas Suresi: http://localhost:3002/quran/112');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
seedTranslations();
