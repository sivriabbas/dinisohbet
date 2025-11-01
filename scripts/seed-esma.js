require('dotenv').config();
const mongoose = require('mongoose');
const Esma = require('../models/Esma');

const esmaData = [
  { number: 1, arabic: "الرَّحْمَنُ", turkish: "Merhamet Sahibi", transliteration: "Er-Rahman", meaning: "Sonsuz merhamet ve şefkat sahibi", description: "Tüm yarattıklarına merhamet eden, acıyan ve şefkat gösteren.", benefit: "Bu ismi zikredenin kalbi Allah sevgisi ile dolar." },
  { number: 2, arabic: "الرَّحِيمُ", turkish: "Esirgeyici", transliteration: "Er-Rahim", meaning: "Müminlere özel merhamet eden", description: "Özellikle müminlere dünya ve ahirette merhamet eden.", benefit: "Sıkıntılardan kurtulmak için okunur." },
  { number: 3, arabic: "الْمَلِكُ", turkish: "Malik", transliteration: "El-Melik", meaning: "Gerçek malik ve sahip", description: "Her şeyin gerçek sahibi ve hükümdarı.", benefit: "Makam ve mevki sahibi olmak için zikredilir." },
  { number: 4, arabic: "الْقُدُّوسُ", turkish: "Mukaddes", transliteration: "El-Kuddus", meaning: "Her türlü eksiklikten uzak", description: "Her türlü kusur ve noksandan münezzeh olan.", benefit: "Kalp temizliği için okunur." },
  { number: 5, arabic: "السَّلاَمُ", turkish: "Selamet Veren", transliteration: "Es-Selam", meaning: "Esenlik ve güvenlik kaynağı", description: "Her türlü kötülükten selamet veren.", benefit: "Hastalıklardan şifa için zikredilir." },
  { number: 6, arabic: "الْمُؤْمِنُ", turkish: "Güven Veren", transliteration: "El-Mu'min", meaning: "Güvenlik ve iman veren", description: "Kullarına güven ve iman bahşeden.", benefit: "Korku ve endişeden kurtulmak için okunur." },
  { number: 7, arabic: "الْمُهَيْمِنُ", turkish: "Gözetici", transliteration: "El-Muhaymin", meaning: "Her şeyi gözetip koruyan", description: "Yarattıklarını gözetip koruyan ve kontrol eden.", benefit: "Korunmak için zikredilir." },
  { number: 8, arabic: "الْعَزِيزُ", turkish: "Aziz", transliteration: "El-Aziz", meaning: "Güçlü ve üstün", description: "Her şeye galip, yenilmez güç sahibi.", benefit: "Düşmanlara karşı güç kazanmak için okunur." },
  { number: 9, arabic: "الْجَبَّارُ", turkish: "Kahhar", transliteration: "El-Cebbar", meaning: "Dilediğini yapan", description: "İradesiyle her şeyi yerine getiren.", benefit: "Zor işlerin hallolması için zikredilir." },
  { number: 10, arabic: "الْمُتَكَبِّرُ", turkish: "Büyüklük Sahibi", transliteration: "El-Mutekebbir", meaning: "Kibirli kullardan münezzeh", description: "Gerçek büyüklük kendisine ait olan.", benefit: "Kibir hastalığından kurtulmak için okunur." },
  { number: 11, arabic: "الْخَالِقُ", turkish: "Yaratıcı", transliteration: "El-Halik", meaning: "Her şeyi yaratan", description: "Var olmayan şeyleri var eden.", benefit: "Yaratıcılık ve üretkenlik için zikredilir." },
  { number: 12, arabic: "الْبَارِئُ", turkish: "Yoktan Var Eden", transliteration: "El-Bari", meaning: "Her şeyi kudretiyle var eden", description: "Hiçbir örneği olmadan yaratan.", benefit: "Yeni başlangıçlar için okunur." },
  { number: 13, arabic: "الْمُصَوِّرُ", turkish: "Şekil Veren", transliteration: "El-Musavvir", meaning: "Her şeye şekil veren", description: "Yarattıklarına en güzel şekli veren.", benefit: "Güzellik ve estetik için zikredilir." },
  { number: 14, arabic: "الْغَفَّارُ", turkish: "Bağışlayan", transliteration: "El-Gaffar", meaning: "Çok bağışlayan", description: "Günahları sürekli bağışlayan.", benefit: "Günahların affı için sıkça okunur." },
  { number: 15, arabic: "الْقَهَّارُ", turkish: "Kahredici", transliteration: "El-Kahhar", meaning: "Her şeye galip", description: "İradesiyle her şeye galip olan.", benefit: "Zulümden kurtulmak için zikredilir." },
  { number: 16, arabic: "الْوَهَّابُ", turkish: "Veren", transliteration: "El-Vehhab", meaning: "Bol bol veren", description: "Karşılık beklemeden sürekli veren.", benefit: "Rızık ve bereket için okunur." },
  { number: 17, arabic: "الرَّزَّاقُ", turkish: "Rızık Veren", transliteration: "Er-Rezzak", meaning: "Rızkı veren", description: "Tüm canlıların rızkını veren.", benefit: "Geçim sıkıntısı için zikredilir." },
  { number: 18, arabic: "الْفَتَّاحُ", turkish: "Açan", transliteration: "El-Fettah", meaning: "Kapıları açan", description: "Kapalı kapıları açan, çözüm yolları gösteren.", benefit: "Çözümsüz işler için okunur." },
  { number: 19, arabic: "اَلْعَلِيْمُ", turkish: "Bilen", transliteration: "El-Alim", meaning: "Her şeyi bilen", description: "Gizli açık her şeyi bilen.", benefit: "İlim ve bilgi için zikredilir." },
  { number: 20, arabic: "الْقَابِضُ", turkish: "Daraltan", transliteration: "El-Kabid", meaning: "Rızkı daraltan", description: "Dilediğine dar geçim veren.", benefit: "El-Basit ile birlikte okunur." },
  { number: 21, arabic: "الْبَاسِطُ", turkish: "Genişleten", transliteration: "El-Basit", meaning: "Rızkı genişleten", description: "Dilediğine bol rızık veren.", benefit: "Bereket ve bolluk için zikredilir." },
  { number: 22, arabic: "الْخَافِضُ", turkish: "Alçaltan", transliteration: "El-Hafid", meaning: "Dilediğini alçaltan", description: "Zalimleri alçaltan.", benefit: "Er-Rafi ile birlikte okunur." },
  { number: 23, arabic: "الرَّافِعُ", turkish: "Yükselten", transliteration: "Er-Rafi", meaning: "Dilediğini yükselten", description: "İyileri yükselten, şereflendir en.", benefit: "Makam ve şeref için zikredilir." },
  { number: 24, arabic: "الْمُعِزُّ", turkish: "İzzetli Kılan", transliteration: "El-Muizz", meaning: "İzzet veren", description: "Dilediğine izzet ve şeref veren.", benefit: "Değer kazanmak için okunur." },
  { number: 25, arabic: "المُذِلُّ", turkish: "Zilletli Kılan", transliteration: "El-Muzill", meaning: "Zillet veren", description: "Zalimleri zillete düşüren.", benefit: "El-Muizz ile birlikte okunur." },
  { number: 26, arabic: "السَّمِيعُ", turkish: "İşiten", transliteration: "Es-Semi", meaning: "Her şeyi işiten", description: "Tüm sesleri ve duaları işiten.", benefit: "Duaların kabulü için zikredilir." },
  { number: 27, arabic: "الْبَصِيرُ", turkish: "Gören", transliteration: "El-Basir", meaning: "Her şeyi gören", description: "Gizli açık her şeyi gören.", benefit: "Basireti açmak için okunur." },
  { number: 28, arabic: "الْحَكَمُ", turkish: "Hakem", transliteration: "El-Hakem", meaning: "Hükmeden", description: "En adil hükmü veren.", benefit: "Adalet için zikredilir." },
  { number: 29, arabic: "الْعَدْلُ", turkish: "Adil", transliteration: "El-Adl", meaning: "Tam adalet sahibi", description: "Mutlak adaletle hükmeden.", benefit: "Adaletsizlikten kurtulmak için okunur." },
  { number: 30, arabic: "اللَّطِيفُ", turkish: "Latif", transliteration: "El-Latif", meaning: "Lütuf sahibi", description: "İnce bir şekilde lütufta bulunan.", benefit: "Zorlukların kolaylaşması için zikredilir." },
  { number: 31, arabic: "الْخَبِيرُ", turkish: "Haberdar", transliteration: "El-Habir", meaning: "Her şeyden haberdar", description: "Gizli saklı her şeyi bilen.", benefit: "Gizli bilgiler için okunur." },
  { number: 32, arabic: "الْحَلِيمُ", turkish: "Halim", transliteration: "El-Halim", meaning: "Yumuşak davranan", description: "Günahkarlara acele ceza vermeyen.", benefit: "Öfkeyi yenmek için zikredilir." },
  { number: 33, arabic: "الْعَظِيمُ", turkish: "Azim", transliteration: "El-Azim", meaning: "Büyük ve yüce", description: "Sonsuz büyüklük sahibi.", benefit: "Azamet için okunur." },
  { number: 34, arabic: "الْغَفُورُ", turkish: "Gafur", transliteration: "El-Gafur", meaning: "Çok bağışlayıcı", description: "Tövbe edenleri bağışlayan.", benefit: "Tövbe kabul için zikredilir." },
  { number: 35, arabic: "الشَّكُورُ", turkish: "Şekür", transliteration: "Eş-Şekur", meaning: "Çok şükreden", description: "Az amele çok mükafat veren.", benefit: "Şükür için okunur." },
  { number: 36, arabic: "الْعَلِيُّ", turkish: "Ali", transliteration: "El-Aliy", meaning: "Yüce", description: "Her şeyden yüce olan.", benefit: "Yücelik için zikredilir." },
  { number: 37, arabic: "الْكَبِيرُ", turkish: "Kebir", transliteration: "El-Kebir", meaning: "Büyük", description: "Her şeyden büyük olan.", benefit: "Büyüklük için okunur." },
  { number: 38, arabic: "الْحَفِيظُ", turkish: "Hafiz", transliteration: "El-Hafiz", meaning: "Koruyan", description: "Her şeyi koruyan ve gözeten.", benefit: "Korunma için zikredilir." },
  { number: 39, arabic: "المُقيِت", turkish: "Mukît", transliteration: "El-Mukit", meaning: "Azık veren", description: "Her canlıya azığını veren.", benefit: "Rızık için okunur." },
  { number: 40, arabic: "الْحسِيبُ", turkish: "Hasib", transliteration: "El-Hasib", meaning: "Hesap gören", description: "Her şeyin hesabını gören.", benefit: "Hesap için zikredilir." },
  { number: 41, arabic: "الْجَلِيلُ", turkish: "Celil", transliteration: "El-Celil", meaning: "Celal sahibi", description: "Azamet ve haşmet sahibi.", benefit: "Şeref için okunur." },
  { number: 42, arabic: "الْكَرِيمُ", turkish: "Kerim", transliteration: "El-Kerim", meaning: "Cömert", description: "Sonsuz cömertlik sahibi.", benefit: "Cömertlik için zikredilir." },
  { number: 43, arabic: "الرَّقِيبُ", turkish: "Rakib", transliteration: "Er-Rakib", meaning: "Gözetleyen", description: "Her an her şeyi gözetleyen.", benefit: "Uyanık olmak için okunur." },
  { number: 44, arabic: "الْمُجِيبُ", turkish: "Mucib", transliteration: "El-Mucib", meaning: "Duaları kabul eden", description: "Dua edenlere cevap veren.", benefit: "Dua kabulü için zikredilir." },
  { number: 45, arabic: "الْوَاسِعُ", turkish: "Vasi", transliteration: "El-Vasi", meaning: "Geniş rahmet sahibi", description: "İlmi ve rahmeti sonsuz olan.", benefit: "Genişlik için okunur." },
  { number: 46, arabic: "الْحَكِيمُ", turkish: "Hakim", transliteration: "El-Hakim", meaning: "Hikmet sahibi", description: "Her işinde hikmet olan.", benefit: "Hikmet için zikredilir." },
  { number: 47, arabic: "الْوَدُودُ", turkish: "Vedud", transliteration: "El-Vedud", meaning: "Çok seven", description: "Kullarını seven ve sevilen.", benefit: "Sevgi için okunur." },
  { number: 48, arabic: "الْمَجِيدُ", turkish: "Mecid", transliteration: "El-Mecid", meaning: "Şan ve şeref sahibi", description: "Üstün şeref sahibi.", benefit: "Şeref için zikredilir." },
  { number: 49, arabic: "الْبَاعِثُ", turkish: "Bais", transliteration: "El-Bais", meaning: "Dirilten", description: "Ölüleri dirilten.", benefit: "Diriliş için okunur." },
  { number: 50, arabic: "الشَّهِيدُ", turkish: "Şehid", transliteration: "Eş-Şehid", meaning: "Şahit", description: "Her şeye şahit olan.", benefit: "Şahitlik için zikredilir." },
  { number: 51, arabic: "الْحَقُّ", turkish: "Hak", transliteration: "El-Hakk", meaning: "Gerçek", description: "Mutlak gerçek olan.", benefit: "Hak için okunur." },
  { number: 52, arabic: "الْوَكِيلُ", turkish: "Vekil", transliteration: "El-Vekil", meaning: "Vekil", description: "İşleri üstlenen.", benefit: "Tevekkül için zikredilir." },
  { number: 53, arabic: "الْقَوِيُّ", turkish: "Kavi", transliteration: "El-Kaviy", meaning: "Güçlü", description: "Sonsuz güç sahibi.", benefit: "Güç için okunur." },
  { number: 54, arabic: "الْمَتِينُ", turkish: "Metin", transliteration: "El-Metin", meaning: "Sağlam", description: "Sarsılmaz güç sahibi.", benefit: "Sağlamlık için zikredilir." },
  { number: 55, arabic: "الْوَلِيُّ", turkish: "Veli", transliteration: "El-Veliy", meaning: "Dost", description: "Müminlerin dostu.", benefit: "Dostluk için okunur." },
  { number: 56, arabic: "الْحَمِيدُ", turkish: "Hamid", transliteration: "El-Hamid", meaning: "Övülmeye layık", description: "Her haliyle övülmeye değer.", benefit: "Hamd için zikredilir." },
  { number: 57, arabic: "الْمُحْصِي", turkish: "Muhsi", transliteration: "El-Muhsi", meaning: "Sayan", description: "Her şeyi sayan.", benefit: "İhsai için okunur." },
  { number: 58, arabic: "الْمُبْدِئُ", turkish: "Mubdi", transliteration: "El-Mubdi", meaning: "Başlatan", description: "Her şeyi ilk kez yaratan.", benefit: "Başlangıç için zikredilir." },
  { number: 59, arabic: "الْمُعِيدُ", turkish: "Muid", transliteration: "El-Muid", meaning: "Tekrar eden", description: "Tekrar diriltecek olan.", benefit: "Yeniden başlangıç için okunur." },
  { number: 60, arabic: "الْمُحْيِي", turkish: "Muhyi", transliteration: "El-Muhyi", meaning: "Dirilten", description: "Can veren, dirilten.", benefit: "Hayat için zikredilir." },
  { number: 61, arabic: "اَلْمُمِيتُ", turkish: "Mumit", transliteration: "El-Mumit", meaning: "Öldüren", description: "Canı alan.", benefit: "El-Muhyi ile birlikte okunur." },
  { number: 62, arabic: "الْحَيُّ", turkish: "Hayy", transliteration: "El-Hayy", meaning: "Diri", description: "Ebediyen diri olan.", benefit: "Hayat için zikredilir." },
  { number: 63, arabic: "الْقَيُّومُ", turkish: "Kayyum", transliteration: "El-Kayyum", meaning: "Kendi kendine kaim", description: "Her şeyi ayakta tutan.", benefit: "Ayakta kalmak için okunur." },
  { number: 64, arabic: "الْوَاجِدُ", turkish: "Vacid", transliteration: "El-Vacid", meaning: "Bulan", description: "Dilediğini bulan.", benefit: "Bulmak için zikredilir." },
  { number: 65, arabic: "الْمَاجِدُ", turkish: "Macid", transliteration: "El-Macid", meaning: "Şerefli", description: "Şeref ve kerem sahibi.", benefit: "Şeref için okunur." },
  { number: 66, arabic: "الْوَاحِدُ", turkish: "Vahid", transliteration: "El-Vahid", meaning: "Bir", description: "Tek olan.", benefit: "Birlik için zikredilir." },
  { number: 67, arabic: "الصَّمَدُ", turkish: "Samed", transliteration: "Es-Samed", meaning: "Her şey O'na muhtaç", description: "Hiçbir şeye muhtaç olmayan.", benefit: "İhtiyaçların giderilmesi için okunur." },
  { number: 68, arabic: "الْقَادِرُ", turkish: "Kadir", transliteration: "El-Kadir", meaning: "Güç yetiren", description: "Her şeye gücü yeten.", benefit: "Güç için zikredilir." },
  { number: 69, arabic: "الْمُقْتَدِرُ", turkish: "Muktedir", transliteration: "El-Muktedir", meaning: "Mutlak güç sahibi", description: "Sınırsız kudret sahibi.", benefit: "Kudret için okunur." },
  { number: 70, arabic: "الْمُقَدِّمُ", turkish: "Mukaddim", transliteration: "El-Mukaddim", meaning: "Öne alan", description: "Dilediğini öne alan.", benefit: "El-Muahhir ile birlikte okunur." },
  { number: 71, arabic: "الْمُؤَخِّرُ", turkish: "Muahhir", transliteration: "El-Muahhir", meaning: "Geriye alan", description: "Dilediğini geriye alan.", benefit: "El-Mukaddim ile birlikte zikredilir." },
  { number: 72, arabic: "الأوَّلُ", turkish: "Evvel", transliteration: "El-Evvel", meaning: "İlk", description: "Başlangıcı olmayan.", benefit: "Başlangıç için okunur." },
  { number: 73, arabic: "الآخِرُ", turkish: "Ahir", transliteration: "El-Ahir", meaning: "Son", description: "Sonu olmayan.", benefit: "Son için zikredilir." },
  { number: 74, arabic: "الظَّاهِرُ", turkish: "Zahir", transliteration: "Ez-Zahir", meaning: "Açık", description: "Varlığı apaçık olan.", benefit: "Açıklık için okunur." },
  { number: 75, arabic: "الْبَاطِنُ", turkish: "Batın", transliteration: "El-Batın", meaning: "Gizli", description: "Mahiyeti gizli olan.", benefit: "Gizli bilgiler için zikredilir." },
  { number: 76, arabic: "الْوَالِي", turkish: "Vali", transliteration: "El-Vali", meaning: "Vali", description: "Her şeyi idare eden.", benefit: "İdare için okunur." },
  { number: 77, arabic: "الْمُتَعَالِي", turkish: "Müteali", transliteration: "El-Müteali", meaning: "Çok yüce", description: "Her şeyden yüce olan.", benefit: "Yücelik için zikredilir." },
  { number: 78, arabic: "الْبَرُّ", turkish: "Berr", transliteration: "El-Berr", meaning: "İyilik eden", description: "Kullarına iyilik eden.", benefit: "İyilik için okunur." },
  { number: 79, arabic: "التَّوَابُ", turkish: "Tevvab", transliteration: "Et-Tevvab", meaning: "Tövbeleri kabul eden", description: "Çokça tövbe kabul eden.", benefit: "Tövbe için zikredilir." },
  { number: 80, arabic: "الْمُنْتَقِمُ", turkish: "Müntekim", transliteration: "El-Muntekim", meaning: "İntikam alan", description: "Zalimlerden intikam alan.", benefit: "Adalet için okunur." },
  { number: 81, arabic: "العَفُوُّ", turkish: "Afüvv", transliteration: "El-Afuvv", meaning: "Affeden", description: "Çok affeden.", benefit: "Af için zikredilir." },
  { number: 82, arabic: "الرَّؤُوفُ", turkish: "Rauf", transliteration: "Er-Rauf", meaning: "Çok merhametli", description: "Sonsuz şefkat sahibi.", benefit: "Merhamet için okunur." },
  { number: 83, arabic: "مَالِكُ الْمُلْكِ", turkish: "Mülkün Sahibi", transliteration: "Malik-ül Mülk", meaning: "Mülkün sahibi", description: "Tüm mülkün gerçek sahibi.", benefit: "Mülkiyet için zikredilir." },
  { number: 84, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", turkish: "Celal ve İkram Sahibi", transliteration: "Zü'l-Celali ve'l-İkram", meaning: "Celal ve ikram sahibi", description: "Azamet ve cömertlik sahibi.", benefit: "Şeref ve ikram için okunur." },
  { number: 85, arabic: "الْمُقْسِطُ", turkish: "Muksit", transliteration: "El-Muksit", meaning: "Adaletli", description: "Tam adaletle hükmeden.", benefit: "Adalet için zikredilir." },
  { number: 86, arabic: "الْجَامِعُ", turkish: "Cami", transliteration: "El-Cami", meaning: "Toplayan", description: "Kıyamette herkesi toplayan.", benefit: "Toplantı için okunur." },
  { number: 87, arabic: "الْغَنِيُّ", turkish: "Gani", transliteration: "El-Ganiy", meaning: "Zengin", description: "Hiçbir şeye muhtaç olmayan.", benefit: "Zenginlik için zikredilir." },
  { number: 88, arabic: "الْمُغْنِي", turkish: "Mugni", transliteration: "El-Mugni", meaning: "Zenginleştiren", description: "Kullarını zengin eden.", benefit: "Zenginlik için okunur." },
  { number: 89, arabic: "اَلْمَانِعُ", turkish: "Mani", transliteration: "El-Mani", meaning: "Engelleyen", description: "Kötülüklerden koruyan.", benefit: "Korunma için zikredilir." },
  { number: 90, arabic: "الضَّارَّ", turkish: "Darr", transliteration: "Ed-Darr", meaning: "Zarar veren", description: "Dilediğine zarar veren.", benefit: "En-Nafi ile birlikte okunur." },
  { number: 91, arabic: "النَّافِعُ", turkish: "Nafi", transliteration: "En-Nafi", meaning: "Fayda veren", description: "Dilediğine fayda veren.", benefit: "Fayda için zikredilir." },
  { number: 92, arabic: "النُّورُ", turkish: "Nur", transliteration: "En-Nur", meaning: "Nur", description: "Göklerin ve yerin nuru.", benefit: "Nurlanmak için okunur." },
  { number: 93, arabic: "الْهَادِي", turkish: "Hadi", transliteration: "El-Hadi", meaning: "Hidayet veren", description: "Doğru yola ileten.", benefit: "Hidayet için zikredilir." },
  { number: 94, arabic: "الْبَدِيعُ", turkish: "Bedi", transliteration: "El-Bedi", meaning: "Eşsiz yaratan", description: "Benzersiz şekilde yaratan.", benefit: "Yaratıcılık için okunur." },
  { number: 95, arabic: "اَلْبَاقِي", turkish: "Baki", transliteration: "El-Baki", meaning: "Ebedi", description: "Sonsuza kadar var olan.", benefit: "Kalıcılık için zikredilir." },
  { number: 96, arabic: "الْوَارِثُ", turkish: "Varis", transliteration: "El-Varis", meaning: "Varis", description: "Her şeyin son varisi.", benefit: "Miras için okunur." },
  { number: 97, arabic: "الرَّشِيدُ", turkish: "Reşid", transliteration: "Er-Reşid", meaning: "Doğru yol gösteren", description: "Her işinde hikmet sahibi.", benefit: "Doğru yol için zikredilir." },
  { number: 98, arabic: "الصَّبُورُ", turkish: "Sabur", transliteration: "Es-Sabur", meaning: "Sabreden", description: "Günahkarlara acele ceza vermeyen.", benefit: "Sabır için okunur." },
  { number: 99, arabic: "الْمَنَّانُ", turkish: "Mennan", transliteration: "El-Mennan", meaning: "Lütuf sahibi", description: "Karşılıksız lütfeden.", benefit: "Lütuf için zikredilir." }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(async () => {
    console.log('MongoDB bağlantısı başarılı');
    
    // Önce tüm Esmaları sil
    await Esma.deleteMany({});
    console.log('Mevcut Esmalar silindi');
    
    // Yeni Esmaları ekle
    await Esma.insertMany(esmaData);
    console.log(`✅ ${esmaData.length} Esma-ül Hüsna başarıyla eklendi!`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Hata:', err);
    process.exit(1);
  });
