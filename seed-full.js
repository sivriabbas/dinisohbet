require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Dua = require('./models/Dua');
const Hadith = require('./models/Hadith');
const Surah = require('./models/Surah');
const Esma = require('./models/Esma');
const PrayerGuide = require('./models/PrayerGuide');

// Veritabanına bağlan
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

async function seedDatabase() {
  try {
    // Mevcut verileri temizle
    console.log('Mevcut veriler temizleniyor...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Dua.deleteMany({});
    await Hadith.deleteMany({});
    await Surah.deleteMany({});
    await Esma.deleteMany({});
    await PrayerGuide.deleteMany({});

    // Kullanıcılar oluştur
    console.log('Kullanıcılar oluşturuluyor...');
    const users = await User.create([
      {
        username: 'AhmetYilmaz',
        email: 'ahmet@example.com',
        password: '123456',
        bio: 'Allah rızası için paylaşım yapıyorum.',
        role: 'admin'
      },
      {
        username: 'FatmaDemir',
        email: 'fatma@example.com',
        password: '123456',
        bio: 'Dini bilgilerimi paylaşmayı seviyorum.',
        role: 'moderator'
      },
      {
        username: 'MehmetKaya',
        email: 'mehmet@example.com',
        password: '123456',
        bio: 'İslami içerikler paylaşıyorum.',
        role: 'user'
      }
    ]);

    console.log(`${users.length} kullanıcı oluşturuldu`);

    // Esma-ül Hüsna oluştur (99 isim)
    console.log('Esma-ül Hüsna oluşturuluyor...');
    const esmas = await Esma.create([
      {
        number: 1,
        arabic: 'الرَّحْمَنُ',
        turkish: 'Er-Rahman',
        transliteration: 'Er-Rahman',
        meaning: 'Merhamet Eden',
        description: 'Sonsuz merhameti ile tüm yarattıklarını kuşatan, dünyada hem mümin hem kafire nimetler veren Allah\'ın ismidir.',
        benefit: 'Bu ismi çok zikreden kimseye Allah rahmet eder.'
      },
      {
        number: 2,
        arabic: 'الرَّحِيمُ',
        turkish: 'Er-Rahim',
        transliteration: 'Er-Rahim',
        meaning: 'Acıyan',
        description: 'Ahirette sadece müminlere has olan, özel rahmet sahibi olan Allah\'ın ismidir.',
        benefit: 'Çok zikreden kimse her türlü sıkıntıdan kurtulur.'
      },
      {
        number: 3,
        arabic: 'الْمَلِكُ',
        turkish: 'El-Melik',
        transliteration: 'El-Melik',
        meaning: 'Malik',
        description: 'Her şeyin gerçek sahibi, kusursuz mülk sahibi olan Allah\'ın ismidir.',
        benefit: 'Çok okuyan kimse dünya ve ahiret nimetlerine kavuşur.'
      },
      {
        number: 4,
        arabic: 'الْقُدُّوسُ',
        turkish: 'El-Kuddüs',
        transliteration: 'El-Kuddüs',
        meaning: 'Mukaddes',
        description: 'Her türlü kusur ve noksanlıktan münezzeh olan, sonsuz kutsallık sahibi Allah\'ın ismidir.',
        benefit: 'Temiz olmak ve pak bir kalbe sahip olmak için zikredilir.'
      },
      {
        number: 5,
        arabic: 'السَّلَامُ',
        turkish: 'Es-Selam',
        transliteration: 'Es-Selam',
        meaning: 'Esenlik Veren',
        description: 'Kendisi her türlü kusurdan uzak, kullarına selam ve esenlik veren Allah\'ın ismidir.',
        benefit: 'Hastalıklardan şifa ve belalardan korunma için okunur.'
      }
    ]);

    console.log(`${esmas.length} Esma-ül Hüsna oluşturuldu (5/${99})`);

    // Sure başlangıçları oluştur
    console.log('Kuran sureleri oluşturuluyor...');
    const surahs = await Surah.create([
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
            transliteration: 'Bismillahirrahmanirrahim'
          },
          {
            number: 2,
            arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            turkish: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.',
            transliteration: 'Elhamdü lillahi rabbil alemin'
          },
          {
            number: 3,
            arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
            turkish: 'O, Rahman\'dır, Rahim\'dir.',
            transliteration: 'Errahmanirrahim'
          },
          {
            number: 4,
            arabic: 'مَالِكِ يَوْمِ الدِّينِ',
            turkish: 'Din (ceza ve mükâfat) gününün sahibidir.',
            transliteration: 'Maliki yevmiddin'
          },
          {
            number: 5,
            arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            turkish: 'Yalnız sana ibadet eder ve yalnız senden yardım dileriz.',
            transliteration: 'İyyake na\'büdü ve iyyake nestein'
          },
          {
            number: 6,
            arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            turkish: 'Bizi doğru yola ilet.',
            transliteration: 'İhdinessıratal müstekim'
          },
          {
            number: 7,
            arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            turkish: 'Kendilerine nimet verdiklerinin yoluna; gazaba uğramışların ve sapıkların yoluna değil.',
            transliteration: 'Sıratellezine en\'amte aleyhim gayrilmagdubi aleyhim veleddaallin'
          }
        ]
      },
      {
        number: 112,
        name: 'İhlas',
        nameArabic: 'الإخلاص',
        meaning: 'Samimiyet',
        numberOfAyahs: 4,
        revelationType: 'Mekki',
        ayahs: [
          {
            number: 1,
            arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
            turkish: 'De ki: O, Allah, birdir.',
            transliteration: 'Kul hüvallahu ehad'
          },
          {
            number: 2,
            arabic: 'اللَّهُ الصَّمَدُ',
            turkish: 'Allah Samed\'dir (her şey O\'na muhtaçtır, O, hiçbir şeye muhtaç değildir).',
            transliteration: 'Allahussamed'
          },
          {
            number: 3,
            arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
            turkish: 'O, doğurmamıştır ve doğrulmamıştır.',
            transliteration: 'Lem yelid ve lem yuled'
          },
          {
            number: 4,
            arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
            turkish: 'O\'nun hiçbir dengi yoktur.',
            transliteration: 'Ve lem yekün lehu küfüven ehad'
          }
        ]
      },
      {
        number: 113,
        name: 'Felak',
        nameArabic: 'الفلق',
        meaning: 'Tan Yeri',
        numberOfAyahs: 5,
        revelationType: 'Mekki',
        ayahs: [
          {
            number: 1,
            arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
            turkish: 'De ki: Tan yerinin Rabbine sığınırım.',
            transliteration: 'Kul euzü birabbil felak'
          },
          {
            number: 2,
            arabic: 'مِن شَرِّ مَا خَلَقَ',
            turkish: 'Yarattığı şeylerin şerrinden,',
            transliteration: 'Min şerri ma halak'
          },
          {
            number: 3,
            arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
            turkish: 'Karanlığı çöktüğü zaman gecenin şerrinden,',
            transliteration: 'Ve min şerri gasıkın iza vekab'
          },
          {
            number: 4,
            arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
            turkish: 'Düğümlere üfleyenlerin şerrinden,',
            transliteration: 'Ve min şerrin neffasati fil ukad'
          },
          {
            number: 5,
            arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
            turkish: 'Ve haset ettiği zaman hasetçinin şerrinden.',
            transliteration: 'Ve min şerri hasidin iza hased'
          }
        ]
      },
      {
        number: 114,
        name: 'Nas',
        nameArabic: 'الناس',
        meaning: 'İnsanlar',
        numberOfAyahs: 6,
        revelationType: 'Mekki',
        ayahs: [
          {
            number: 1,
            arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
            turkish: 'De ki: İnsanların Rabbine,',
            transliteration: 'Kul euzü birabbin nas'
          },
          {
            number: 2,
            arabic: 'مَلِكِ النَّاسِ',
            turkish: 'İnsanların Malikine,',
            transliteration: 'Melikin nas'
          },
          {
            number: 3,
            arabic: 'إِلَٰهِ النَّاسِ',
            turkish: 'İnsanların İlahına sığınırım.',
            transliteration: 'İlahin nas'
          },
          {
            number: 4,
            arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
            turkish: 'Sinsi vesvesecinin şerrinden;',
            transliteration: 'Min şerril vesvesil hannas'
          },
          {
            number: 5,
            arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
            turkish: 'O ki, insanların göğüslerine vesvese verir.',
            transliteration: 'Ellezi yuvesvisu fi sudurin nas'
          },
          {
            number: 6,
            arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
            turkish: 'İster cinlerden olsun, ister insanlardan.',
            transliteration: 'Minel cinneti ven nas'
          }
        ]
      }
    ]);

    console.log(`${surahs.length} sure oluşturuldu`);

    // Hadisler oluştur
    console.log('Hadisler oluşturuluyor...');
    const hadiths = await Hadith.create([
      {
        title: 'İmanın Şubeleri',
        arabicText: 'الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ: لا إِلَهَ إِلا اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ، وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ',
        turkishText: 'İman yetmiş küsur şubedir. En üstünü "La ilahe illallah" demek, en aşağısı eziyet veren şeyi yoldan kaldırmaktır. Hayâ da imandan bir şubedir.',
        source: 'Müslim',
        category: 'iman',
        bookNumber: 'İman',
        hadithNumber: '35'
      },
      {
        title: 'İlim Öğrenmenin Fazileti',
        arabicText: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
        turkishText: 'İlim öğrenmek her müslümana farzdır.',
        source: 'İbn Mace',
        category: 'ilim',
        bookNumber: 'Mukaddime',
        hadithNumber: '224'
      },
      {
        title: 'Güzel Ahlak',
        arabicText: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلاَقِ',
        turkishText: 'Ben ancak güzel ahlakı tamamlamak için gönderildim.',
        source: 'Muvatta',
        category: 'ahlak',
        bookNumber: 'Hüsnül Hulk',
        hadithNumber: '8'
      },
      {
        title: 'Namazın Önemi',
        arabicText: 'الصَّلاَةُ عِمَادُ الدِّينِ',
        turkishText: 'Namaz dinin direğidir.',
        source: 'Buhari',
        category: 'ibadet',
        bookNumber: 'Salat',
        hadithNumber: '1'
      },
      {
        title: 'Komşuya İyilik',
        arabicText: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ',
        turkishText: 'Allah\'a ve ahiret gününe iman eden kimse komşusuna ikramda bulunsun.',
        source: 'Buhari',
        category: 'ahlak',
        bookNumber: 'Edeb',
        hadithNumber: '31'
      }
    ]);

    console.log(`${hadiths.length} hadis oluşturuldu`);

    // İbadet Rehberleri
    console.log('İbadet rehberleri oluşturuluyor...');
    const guides = await PrayerGuide.create([
      {
        title: 'Abdest Nasıl Alınır?',
        category: 'abdest',
        content: 'Abdest, namaz ve diğer ibadetler için gerekli olan temizliğin bir şeklidir. Hem bedeni hem de ruhi temizlik sağlar.',
        steps: [
          {
            stepNumber: 1,
            title: 'Niyet',
            description: 'Abdest almak için kalben niyet edilir. "Nafile/farz namaz için abdest almaya niyet ettim" denir.'
          },
          {
            stepNumber: 2,
            title: 'Besmele Çekmek',
            description: 'Bismillahirrahmanirrahim denir.'
          },
          {
            stepNumber: 3,
            title: 'Elleri Yıkamak',
            description: 'Her iki el bileklere kadar üç defa yıkanır.'
          },
          {
            stepNumber: 4,
            title: 'Ağız Çalkalamak',
            description: 'Ağız üç defa çalkalanır.'
          },
          {
            stepNumber: 5,
            title: 'Burun Temizlemek',
            description: 'Burna üç defa su çekilir ve temizlenir.'
          },
          {
            stepNumber: 6,
            title: 'Yüz Yıkamak',
            description: 'Yüz alından çeneye, kulaktan kulağa üç defa yıkanır.'
          },
          {
            stepNumber: 7,
            title: 'Kolları Yıkamak',
            description: 'Önce sağ, sonra sol kol dirsekler dahil üçer defa yıkanır.'
          },
          {
            stepNumber: 8,
            title: 'Başı Meshetmek',
            description: 'Islak eller ile başın dörtte biri en az bir defa meshedilir.'
          },
          {
            stepNumber: 9,
            title: 'Kulakları Meshetmek',
            description: 'İç ve dış kulaklar meshedilir.'
          },
          {
            stepNumber: 10,
            title: 'Ayakları Yıkamak',
            description: 'Önce sağ, sonra sol ayak topuklar dahil üçer defa yıkanır.'
          }
        ],
        conditions: [
          'Müslüman olmak',
          'Akıllı olmak',
          'Buluğ çağına ermiş olmak',
          'Abdest almaya engel bir mazeret olmamak'
        ],
        invalidators: [
          'Küçük ve büyük abdest bozmak',
          'Uykuya dalmak',
          'Baygınlık, sarhoşluk',
          'Delilik',
          'Gülmek (namazda)',
          'Kan, irin, sarı su akması'
        ]
      },
      {
        title: 'Namaz Nasıl Kılınır?',
        category: 'namaz',
        content: 'Namaz, müslümanların Allah\'a kulluk yapmanın en önemli şeklidir. Günde beş vakit farz olan namazın nasıl kılınacağını öğrenelim.',
        steps: [
          {
            stepNumber: 1,
            title: 'Kıbleye Yönelmek',
            description: 'Kabe yönüne (kıbleye) dönülür.'
          },
          {
            stepNumber: 2,
            title: 'Niyet Etmek',
            description: 'Kalben hangi namazı kılacağınıza niyet edersiniz.'
          },
          {
            stepNumber: 3,
            title: 'İftitah Tekbiri',
            description: 'Eller kulak hizasına kaldırılır ve "Allahu Ekber" denir.'
          },
          {
            stepNumber: 4,
            title: 'Eller Bağlanır',
            description: 'Eller göbek altında (kadınlar göğüs hizasında) bağlanır.'
          },
          {
            stepNumber: 5,
            title: 'Sübhaneke Duası',
            description: 'Açılış duası olan Sübhaneke okunur.'
          },
          {
            stepNumber: 6,
            title: 'Fatiha Suresi',
            description: 'Fatiha suresi okunur.'
          },
          {
            stepNumber: 7,
            title: 'Zamm-ı Sure',
            description: 'Fatiha\'dan sonra bilinen bir sure veya en az üç ayet okunur.'
          },
          {
            stepNumber: 8,
            title: 'Rüku',
            description: '"Allahu Ekber" denilerek rükuya eğilir. Rükuda "Sübhane Rabbiyel Azim" üç defa söylenir.'
          },
          {
            stepNumber: 9,
            title: 'Kıyam',
            description: '"Semi Allahu limen hamideh" denilerek doğrulunur, "Rabbena leke\'l hamd" denir.'
          },
          {
            stepNumber: 10,
            title: 'Secde',
            description: '"Allahu Ekber" denilerek secdeye varılır. "Sübhane Rabbiyel A\'la" üç defa söylenir.'
          }
        ],
        conditions: [
          'Müslüman olmak',
          'Akıllı olmak',
          'Buluğ çağına ermiş olmak',
          'Temiz olmak (abdestli veya gusl almış)',
          'Vaktinin girmiş olması',
          'Kıbleye yönelmek',
          'Avret yerlerini örtmek'
        ],
        sunnah: [
          'Cemaatle kılmak',
          'Mescidde kılmak',
          'Vakit girer girmez kılmak',
          'Sütreye yönelmek',
          'Huşu ile kılmak'
        ]
      }
    ]);

    console.log(`${guides.length} rehber oluşturuldu`);

    // Mevcut paylaşımları koru (seed-backup.js\'den)
    const posts = await Post.create([
      {
        title: 'Mü\'minin Ahlakı Hakkında Hadis',
        content: 'Peygamber Efendimiz (s.a.v) buyurdu: "Mü\'minlerin iman bakımından en mükemmeli, ahlakı en güzel olanıdır..."',
        category: 'hadis',
        author: users[0]._id,
        tags: ['hadis', 'ahlak'],
        viewCount: 45
      }
    ]);

    // Mevcut duaları koru
    const duas = await Dua.create([
      {
        title: 'Sabah Akşam Duası - Ayetel Kürsi',
        arabicText: 'اللّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...',
        turkishText: 'Allahü la ilahe illa hüvel hayyül kayyum...',
        meaning: 'Allah, O\'ndan başka ilah yoktur...',
        category: 'sabah',
        source: 'Bakara Suresi, 255',
        addedBy: users[0]._id,
        isApproved: true,
        viewCount: 156
      }
    ]);

    console.log('\n✅ Kapsamlı veritabanı başarıyla oluşturuldu!');
    console.log(`📊 Özet:`);
    console.log(`   - ${users.length} kullanıcı`);
    console.log(`   - ${posts.length} paylaşım`);
    console.log(`   - ${duas.length} dua`);
    console.log(`   - ${hadiths.length} hadis`);
    console.log(`   - ${surahs.length} sure`);
    console.log(`   - ${esmas.length} Esma-ül Hüsna`);
    console.log(`   - ${guides.length} ibadet rehberi`);
    console.log('\n🌟 İslami Portal tam donanımlı!');
    console.log('Test kullanıcısı: ahmet@example.com | Şifre: 123456');

  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nVeritabanı bağlantısı kapatıldı.');
  }
}

seedDatabase();
