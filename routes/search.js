const express = require('express');
const router = express.Router();
const Surah = require('../models/Surah');
const Hadith = require('../models/Hadith');
const Dua = require('../models/Dua');

// Ana arama sayfası
router.get('/', async (req, res) => {
  const { q, type } = req.query;
  
  if (!q) {
    return res.render('search/index', {
      query: '',
      type: type || 'all',
      results: null
    });
  }

  try {
    const searchQuery = q.trim();
    const searchType = type || 'all';
    const results = {
      quran: [],
      hadiths: [],
      duas: []
    };

    // Kuran Arama
    if (searchType === 'all' || searchType === 'quran') {
      const surahs = await Surah.find({}).lean();
      
      surahs.forEach(surah => {
        if (surah.ayahs && Array.isArray(surah.ayahs)) {
          surah.ayahs.forEach(ayah => {
            const matchArabic = ayah.arabic && ayah.arabic.includes(searchQuery);
            const matchTurkish = ayah.turkish && ayah.turkish.toLowerCase().includes(searchQuery.toLowerCase());
            const matchTranslit = ayah.transliteration && ayah.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (matchArabic || matchTurkish || matchTranslit) {
              results.quran.push({
                surahNumber: surah.number,
                surahName: surah.name,
                ayahNumber: ayah.number,
                arabic: ayah.arabic,
                turkish: ayah.turkish,
                transliteration: ayah.transliteration,
                highlighted: highlightText(ayah.turkish, searchQuery)
              });
            }
          });
        }
      });
    }

    // Hadis Arama
    if (searchType === 'all' || searchType === 'hadith') {
      const hadithQuery = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { arabicText: { $regex: searchQuery, $options: 'i' } },
          { turkishText: { $regex: searchQuery, $options: 'i' } }
        ]
      };
      
      const hadiths = await Hadith.find(hadithQuery).limit(50).lean();
      results.hadiths = hadiths.map(h => ({
        ...h,
        highlighted: highlightText(h.turkishText, searchQuery)
      }));
    }

    // Dua Arama
    if (searchType === 'all' || searchType === 'dua') {
      const duaQuery = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { arabic: { $regex: searchQuery, $options: 'i' } },
          { turkish: { $regex: searchQuery, $options: 'i' } },
          { transliteration: { $regex: searchQuery, $options: 'i' } }
        ]
      };
      
      const duas = await Dua.find(duaQuery).limit(50).lean();
      results.duas = duas.map(d => ({
        ...d,
        highlighted: highlightText(d.turkish, searchQuery)
      }));
    }

    // Toplam sonuç sayısı
    const totalResults = results.quran.length + results.hadiths.length + results.duas.length;

    res.render('search/index', {
      query: searchQuery,
      type: searchType,
      results,
      totalResults
    });

  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).render('search/index', {
      query: q,
      type: type || 'all',
      results: null,
      error: 'Arama sırasında bir hata oluştu.'
    });
  }
});

// API endpoint - JSON formatında arama sonuçları
router.get('/api/search', async (req, res) => {
  const { q, type, limit } = req.query;
  
  if (!q) {
    return res.json({ error: 'Arama terimi gerekli' });
  }

  try {
    const searchQuery = q.trim();
    const searchType = type || 'all';
    const maxResults = parseInt(limit) || 20;
    const results = {
      quran: [],
      hadiths: [],
      duas: [],
      query: searchQuery,
      type: searchType
    };

    // Kuran Arama
    if (searchType === 'all' || searchType === 'quran') {
      const surahs = await Surah.find({}).lean();
      
      surahs.forEach(surah => {
        if (surah.ayahs && Array.isArray(surah.ayahs)) {
          surah.ayahs.forEach(ayah => {
            if (results.quran.length < maxResults) {
              const match = 
                (ayah.arabic && ayah.arabic.includes(searchQuery)) ||
                (ayah.turkish && ayah.turkish.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (ayah.transliteration && ayah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (match) {
                results.quran.push({
                  surahNumber: surah.number,
                  surahName: surah.name,
                  ayahNumber: ayah.number,
                  arabic: ayah.arabic,
                  turkish: ayah.turkish
                });
              }
            }
          });
        }
      });
    }

    // Hadis Arama
    if (searchType === 'all' || searchType === 'hadith') {
      const hadiths = await Hadith.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { arabicText: { $regex: searchQuery, $options: 'i' } },
          { turkishText: { $regex: searchQuery, $options: 'i' } }
        ]
      }).limit(maxResults).lean();
      
      results.hadiths = hadiths;
    }

    // Dua Arama
    if (searchType === 'all' || searchType === 'dua') {
      const duas = await Dua.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { arabic: { $regex: searchQuery, $options: 'i' } },
          { turkish: { $regex: searchQuery, $options: 'i' } }
        ]
      }).limit(maxResults).lean();
      
      results.duas = duas;
    }

    results.totalResults = results.quran.length + results.hadiths.length + results.duas.length;

    res.json(results);

  } catch (error) {
    console.error('API Arama hatası:', error);
    res.status(500).json({ error: 'Arama sırasında bir hata oluştu.' });
  }
});

// Yardımcı fonksiyon: Metin vurgulama
function highlightText(text, query) {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
