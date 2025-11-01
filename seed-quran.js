require('dotenv').config();
const mongoose = require('mongoose');
const Surah = require('./models/Surah');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

async function seedQuran() {
  try {
    console.log('Kuran verileri ekleniyor...');
    
    // Örnek sureler (ilk 3 sure)
    const surahs = [
      {
        number: 1,
        name: 'Fatiha',
        nameArabic: 'الفاتحة',
        meaning: 'Açılış',
        numberOfAyahs: 7,
        revelationType: 'Mekki',
        ayahs: [
          {
            number: 1,
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            turkish: 'Rahman ve Rahim olan Allah\'ın adıyla.',
            transliteration: 'Bismillâhirrahmânirrahîm',
            translations: {
              diyanet: 'Rahman ve Rahim olan Allah\'ın adıyla.'
            }
          },
          {
            number: 2,
            arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            turkish: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.',
            transliteration: 'Elhamdülillâhi rabbil âlemîn',
            translations: {
              diyanet: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.'
            }
          },
          {
            number: 3,
            arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
            turkish: 'O, Rahman\'dır, Rahim\'dir.',
            transliteration: 'Errahmânirrahîm',
            translations: {
              diyanet: 'O, Rahman\'dır, Rahim\'dir.'
            }
          },
          {
            number: 4,
            arabic: 'مَالِكِ يَوْمِ الدِّينِ',
            turkish: 'Din (ceza ve mükâfat) gününün malikidir.',
            transliteration: 'Mâliki yevmiddîn',
            translations: {
              diyanet: 'Din (ceza ve mükâfat) gününün malikidir.'
            }
          },
          {
            number: 5,
            arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            turkish: 'Yalnız sana ibadet eder ve yalnız senden yardım dileriz.',
            transliteration: 'İyyâke na\'büdü ve iyyâke nesteîn',
            translations: {
              diyanet: 'Yalnız sana ibadet eder ve yalnız senden yardım dileriz.'
            }
          },
          {
            number: 6,
            arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            turkish: 'Bizi doğru yola ilet.',
            transliteration: 'İhdinassırâtal mustakîm',
            translations: {
              diyanet: 'Bizi doğru yola ilet.'
            }
          },
          {
            number: 7,
            arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            turkish: 'Kendilerine nimet verdiklerinin yoluna; gazaba uğramışların ve sapıtmışların yoluna değil.',
            transliteration: 'Sırâtallezîne en\'amte aleyhim ğayril mağdûbi aleyhim veleddâllîn',
            translations: {
              diyanet: 'Kendilerine nimet verdiklerinin yoluna; gazaba uğramışların ve sapıtmışların yoluna değil.'
            }
          }
        ]
      },
      {
        number: 2,
        name: 'Bakara',
        nameArabic: 'البقرة',
        meaning: 'İnek',
        numberOfAyahs: 286,
        revelationType: 'Medeni',
        ayahs: [
          {
            number: 1,
            arabic: 'الم',
            turkish: 'Elif, Lâm, Mîm.',
            transliteration: 'Elif Lâm Mîm',
            translations: {
              diyanet: 'Elif, Lâm, Mîm.'
            }
          },
          {
            number: 2,
            arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
            turkish: 'Bu Kitap\'ta şüphe yoktur. Allah\'a karşı gelmekten sakınanlar için bir hidayet rehberidir.',
            transliteration: 'Zâlikel kitâbü lâ raybe fîh, hüden lil muttakîn',
            translations: {
              diyanet: 'Bu Kitap\'ta şüphe yoktur. Allah\'a karşı gelmekten sakınanlar için bir hidayet rehberidir.'
            }
          },
          {
            number: 3,
            arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ',
            turkish: 'Onlar gaybe iman eder, namazı dosdoğru kılar ve kendilerine rızık olarak verdiğimiz şeylerden Allah yolunda harcarlar.',
            transliteration: 'Ellezîne yu\'minûne bil ğaybi ve yukîmûnes salâte ve mimmâ razaknâhüm yünfikûn',
            translations: {
              diyanet: 'Onlar gaybe iman eder, namazı dosdoğru kılar ve kendilerine rızık olarak verdiğimiz şeylerden Allah yolunda harcarlar.'
            }
          }
        ]
      },
      {
        number: 112,
        name: 'İhlas',
        nameArabic: 'الإخلاص',
        meaning: 'İhlas / Samimiyet',
        numberOfAyahs: 4,
        revelationType: 'Mekki',
        ayahs: [
          {
            number: 1,
            arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
            turkish: 'De ki: O, Allah\'tır, bir tektir.',
            transliteration: 'Kul hüvallâhü ehad',
            translations: {
              diyanet: 'De ki: O, Allah\'tır, bir tektir.'
            }
          },
          {
            number: 2,
            arabic: 'اللَّهُ الصَّمَدُ',
            turkish: 'Allah Samed\'dir (her şey O\'na muhtaçtır; O, hiçbir şeye muhtaç değildir).',
            transliteration: 'Allâhus samed',
            translations: {
              diyanet: 'Allah Samed\'dir (her şey O\'na muhtaçtır; O, hiçbir şeye muhtaç değildir).'
            }
          },
          {
            number: 3,
            arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
            turkish: 'O doğurmamıştır ve doğmamıştır.',
            transliteration: 'Lem yelid ve lem yûled',
            translations: {
              diyanet: 'O doğurmamıştır ve doğmamıştır.'
            }
          },
          {
            number: 4,
            arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
            turkish: 'Hiçbir şey O\'na denk ve benzer değildir.',
            transliteration: 'Ve lem yekün lehû küfüven ehad',
            translations: {
              diyanet: 'Hiçbir şey O\'na denk ve benzer değildir.'
            }
          }
        ]
      }
    ];

    await Surah.deleteMany({});
    await Surah.insertMany(surahs);
    
    console.log(`✅ ${surahs.length} sure eklendi!`);
    console.log('🎉 Kuran verileri başarıyla yüklendi!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

seedQuran();
