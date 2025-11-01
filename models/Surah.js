const mongoose = require('mongoose');

const surahSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nameArabic: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  numberOfAyahs: {
    type: Number,
    required: true
  },
  revelationType: {
    type: String,
    enum: ['Mekki', 'Medeni'],
    required: true
  },
  ayahs: [{
    number: Number,
    arabic: String,
    turkish: String,
    transliteration: String,
    translations: {
      diyanet: String,      // Diyanet İşleri Meali
      elmali: String,       // Elmalılı Hamdi Yazır Meali
      ates: String,         // Süleyman Ateş Meali
      yuksek: String,       // Ömer Nasuhi Bilmen Meali
      vakfi: String         // Türkiye Diyanet Vakfı Meali
    },
    tafsir: String
  }]
});

module.exports = mongoose.model('Surah', surahSchema);
