const mongoose = require('mongoose');
const Hadith = require('../models/Hadith');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/dinisohbet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Zengin Hadis Koleksiyonu
const hadiths = [
  // BUHARI HADİSLERİ - İMAN
  {
    title: "Amellerin Niyete Bağlı Olması",
    arabicText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    turkishText: "Ameller niyetlere göredir. Herkes için niyet ettiği şey vardır. Kim hicret etmesi Allah'a ve Resulü'ne ise, hicreti Allah'a ve Resulü'nedir. Kim dünya malı veya bir kadınla evlenmek için hicret ederse, hicreti o şey içindir.",
    source: "Buhari",
    category: "iman",
    bookNumber: "1",
    hadithNumber: "1"
  },
  {
    title: "İmanın Şubeleri",
    arabicText: "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    turkishText: "İman yetmiş küsur şubedir. En üstünü 'Lâ ilâhe illallâh' demek, en aşağısı ise yoldan eziyet verici şeyleri kaldırmaktır. Hayâ da imandandır.",
    source: "Buhari",
    category: "iman",
    bookNumber: "2",
    hadithNumber: "9"
  },
  
  // BUHARI - İBADET
  {
    title: "Namazın İslam'daki Yeri",
    arabicText: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ",
    turkishText: "İslam beş şey üzerine bina edilmiştir: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın kulu ve elçisi olduğuna şahitlik etmek, namaz kılmak, zekat vermek, hac ve Ramazan orucunu tutmak.",
    source: "Buhari",
    category: "ibadet",
    bookNumber: "2",
    hadithNumber: "7"
  },
  {
    title: "Namaz Vakitlerinin Fazileti",
    arabicText: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ تَعَالَى الصَّلَاةُ لِوَقْتِهَا",
    turkishText: "Allah'a en sevimli amel, vaktinde kılınan namazdır. Sonra ana babaya iyilik yapmak, sonra Allah yolunda cihad etmektir.",
    source: "Buhari",
    category: "ibadet",
    bookNumber: "10",
    hadithNumber: "527"
  },
  
  // MÜSLİM HADİSLERİ - İMAN
  {
    title: "Müslümanın Tanımı",
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    turkishText: "Müslüman, Müslümanların dilinden ve elinden emin olduğu kimsedir. Mü'min de insanların canlarından ve mallarından emin oldukları kimsedir.",
    source: "Müslim",
    category: "iman",
    bookNumber: "1",
    hadithNumber: "40"
  },
  {
    title: "İmanın Artması ve Eksilmesi",
    arabicText: "الْإِيمَانُ يَزِيدُ وَيَنْقُصُ",
    turkishText: "İman artar ve eksilir. İtaat ile artar, günah ile eksilir. En kamil iman sahipleri, ahlakları en güzel olanlardır.",
    source: "Müslim",
    category: "iman",
    bookNumber: "1",
    hadithNumber: "59"
  },
  
  // MÜSLİM - AHLAK
  {
    title: "Güzel Ahlak",
    arabicText: "إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنُكُمْ أَخْلَاقًا",
    turkishText: "Sizin bana en sevgili olanınız ve kıyamet gününde bana en yakın oturanınız, ahlakı en güzel olanınızdır.",
    source: "Müslim",
    category: "ahlak",
    bookNumber: "45",
    hadithNumber: "2321"
  },
  {
    title: "Müslüman Kardeşliği",
    arabicText: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    turkishText: "Mü'min mü'min için bir bina gibidir. Birbirine destek olur. (Peygamber (s.a.v) parmaklarını birbirine geçirdi)",
    source: "Müslim",
    category: "ahlak",
    bookNumber: "45",
    hadithNumber: "2585"
  },
  
  // EBU DAVUD - İBADET
  {
    title: "Abdest Almak",
    arabicText: "لَا يَقْبَلُ اللَّهُ صَلَاةً بِغَيْرِ طُهُورٍ",
    turkishText: "Allah temizlik olmadan namazı kabul etmez.",
    source: "Ebu Davud",
    category: "ibadet",
    bookNumber: "1",
    hadithNumber: "59"
  },
  {
    title: "Sabah ve Akşam Duaları",
    arabicText: "مَنْ قَالَ حِينَ يُصْبِحُ وَحِينَ يُمْسِي سُبْحَانَ اللَّهِ وَبِحَمْدِهِ مِائَةَ مَرَّةٍ",
    turkishText: "Kim sabah ve akşam yüz defa 'Sübhanallahi ve bihamdihi' derse, kıyamet gününde ondan daha hayırlı bir şeyle gelen olmaz.",
    source: "Ebu Davud",
    category: "ibadet",
    bookNumber: "2",
    hadithNumber: "1463"
  },
  
  // TİRMİZİ - AHLAK
  {
    title: "Ana Babaya İyilik",
    arabicText: "رِضَا اللَّهِ فِي رِضَا الْوَالِدِ وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدِ",
    turkishText: "Allah'ın rızası babanın rızasındadır, Allah'ın gazabı da babanın gazabındadır.",
    source: "Tirmizi",
    category: "ahlak",
    bookNumber: "25",
    hadithNumber: "1899"
  },
  {
    title: "İyilik ve Kötülük",
    arabicText: "الْبِرُّ حُسْنُ الْخُلُقِ وَالْإِثْمُ مَا حَاكَ فِي نَفْسِكَ",
    turkishText: "İyilik güzel ahlaktır. Günah ise nefsinde şüphe uyandıran ve insanların öğrenmesini istemediğin şeydir.",
    source: "Tirmizi",
    category: "ahlak",
    bookNumber: "27",
    hadithNumber: "2389"
  },
  
  // NESAİ - İLİM
  {
    title: "İlim Talep Etmek",
    arabicText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    turkishText: "İlim öğrenmek her Müslüman'a farzdır.",
    source: "Nesai",
    category: "ilim",
    bookNumber: "1",
    hadithNumber: "224"
  },
  {
    title: "İlmin Fazileti",
    arabicText: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    turkishText: "Kim ilim öğrenmek için bir yola girerse, Allah ona cennet yolunu kolaylaştırır.",
    source: "Nesai",
    category: "ilim",
    bookNumber: "1",
    hadithNumber: "225"
  },
  
  // İBN MACE - MUAMELAT
  {
    title: "Helal Kazanç",
    arabicText: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا",
    turkishText: "Şüphesiz Allah temizdir, temiz olandan başkasını kabul etmez.",
    source: "İbn Mace",
    category: "muamelat",
    bookNumber: "13",
    hadithNumber: "2142"
  },
  {
    title: "Ticaretin Adabı",
    arabicText: "التَّاجِرُ الصَّدُوقُ الْأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ",
    turkishText: "Doğru ve güvenilir tüccar, peygamberler, sıddıklar ve şehitler ile beraberdir.",
    source: "İbn Mace",
    category: "muamelat",
    bookNumber: "12",
    hadithNumber: "2139"
  },
  
  // MUVATTA - EDEB
  {
    title: "Komşu Hakkı",
    arabicText: "مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ",
    turkishText: "Cebrail bana komşu hakkında o kadar çok tavsiyede bulundu ki, neredeyse ona miras hakkı verecek sandım.",
    source: "Muvatta",
    category: "edeb",
    bookNumber: "47",
    hadithNumber: "1"
  },
  {
    title: "Misafire İkram",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
    turkishText: "Allah'a ve ahiret gününe iman eden, misafirine ikram etsin.",
    source: "Muvatta",
    category: "edeb",
    bookNumber: "47",
    hadithNumber: "5"
  },
  
  // Ek BUHARI hadisleri
  {
    title: "Zekatın Önemi",
    arabicText: "مَا نَقَصَ مَالٌ مِنْ صَدَقَةٍ",
    turkishText: "Sadaka vermekle mal eksilmez. Allah, af edene izzet verir. Kim Allah için tevazu gösterirse, Allah onu yükseltir.",
    source: "Buhari",
    category: "ibadet",
    bookNumber: "24",
    hadithNumber: "1403"
  },
  {
    title: "Oruç Tutmanın Fazileti",
    arabicText: "الصِّيَامُ جُنَّةٌ",
    turkishText: "Oruç bir kalkandır. Oruçlu kimse kötü söz söylememeli ve cahillik yapmamalıdır. Eğer biri kendisine sövüp sataşırsa, 'Ben oruçluyum' desin.",
    source: "Buhari",
    category: "ibadet",
    bookNumber: "30",
    hadithNumber: "1894"
  },
  {
    title: "Kur'an Öğrenmenin Fazileti",
    arabicText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    turkishText: "Sizin en hayırlınız Kur'an öğrenen ve öğretendir.",
    source: "Buhari",
    category: "ilim",
    bookNumber: "66",
    hadithNumber: "5027"
  },
  
  // MÜSLİM ekleri
  {
    title: "Dünya ve Ahiret",
    arabicText: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    turkishText: "Dünya mü'min için bir zindandır, kafir için ise cennettir.",
    source: "Müslim",
    category: "iman",
    bookNumber: "53",
    hadithNumber: "2956"
  },
  {
    title: "Sadaka-i Cariye",
    arabicText: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ",
    turkishText: "İnsan ölünce üç şey dışında ameli kesilir: Sadaka-i cariye, faydalı ilim ve kendisine dua eden salih evlat.",
    source: "Müslim",
    category: "ilim",
    bookNumber: "13",
    hadithNumber: "1631"
  },
  {
    title: "Cemaatin Fazileti",
    arabicText: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    turkishText: "Cemaatle kılınan namaz, tek başına kılınan namazdan yirmi yedi derece daha faziletlidir.",
    source: "Müslim",
    category: "ibadet",
    bookNumber: "4",
    hadithNumber: "650"
  },
  {
    title: "Tevbe ve İstiğfar",
    arabicText: "التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لَا ذَنْبَ لَهُ",
    turkishText: "Günahtan tevbe eden, günahı olmayan gibidir.",
    source: "İbn Mace",
    category: "iman",
    bookNumber: "37",
    hadithNumber: "4250"
  },
  {
    title: "Gıybet Etmemek",
    arabicText: "أَتَدْرُونَ مَا الْغِيبَةُ",
    turkishText: "Gıybetin ne olduğunu biliyor musunuz? Kardeşini, hoşlanmadığı bir şekilde anmandır.",
    source: "Müslim",
    category: "ahlak",
    bookNumber: "45",
    hadithNumber: "2589"
  },
  {
    title: "Sabır ve Şükür",
    arabicText: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ",
    turkishText: "Mü'minin hali ne kadar da şaşılacak bir şeydir! Onun her hali hayırdır. Başına bir sevinç geldiğinde şükreder, bu onun için hayırdır. Başına bir sıkıntı geldiğinde sabreder, bu da onun için hayırdır.",
    source: "Müslim",
    category: "iman",
    bookNumber: "53",
    hadithNumber: "2999"
  }
];

// Hadisleri veritabanına ekle
async function seedHadiths() {
  try {
    // Önce mevcut hadisleri temizle
    await Hadith.deleteMany({});
    console.log('Mevcut hadisler silindi');

    // Yeni hadisleri ekle
    const result = await Hadith.insertMany(hadiths);
    console.log(`${result.length} hadis başarıyla eklendi!`);

    // Kaynak bazında sayıları göster
    const sources = await Hadith.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nKaynak bazında hadis sayıları:');
    sources.forEach(s => {
      console.log(`${s._id}: ${s.count} hadis`);
    });

    // Kategori bazında sayıları göster
    const categories = await Hadith.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nKategori bazında hadis sayıları:');
    categories.forEach(c => {
      console.log(`${c._id}: ${c.count} hadis`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

// Script'i çalıştır
seedHadiths();
