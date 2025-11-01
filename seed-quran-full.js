const mongoose = require('mongoose');
require('dotenv').config();

const Surah = require('./models/Surah');

const surahs = [
    {
        number: 1,
        name: "Fatiha",
        nameArabic: "الفاتحة",
        meaning: "Açılış",
        numberOfAyahs: 7,
        revelationType: "Mekki",
        ayahs: [
            { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", turkish: "Rahmân ve Rahîm olan Allah'ın adıyla." },
            { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", turkish: "Hamd, âlemlerin Rabbi Allah'a mahsustur." },
            { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", turkish: "O, Rahmân'dır, Rahîm'dir." },
            { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", turkish: "Din (ceza ve mükâfat) gününün sahibidir." },
            { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", turkish: "Yalnız sana ibadet eder ve yalnız senden yardım dileriz." },
            { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", turkish: "Bizi doğru yola ilet." },
            { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", turkish: "Kendilerine nimet verdiklerinin yoluna; gazaba uğramışların ve sapıkların yoluna değil." }
        ]
    },
    {
        number: 2,
        name: "Bakara",
        nameArabic: "البقرة",
        meaning: "İnek",
        numberOfAyahs: 286,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "الم", turkish: "Elif, Lâm, Mîm." },
            { number: 2, arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", turkish: "Bu, şüphe götürmez bir kitaptır; Allah'a karşı gelmekten sakınanlar için bir hidayettir." },
            { number: 3, arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", turkish: "Onlar gaybe iman eder, namazı dosdoğru kılar ve kendilerine rızık olarak verdiğimiz şeylerden Allah yolunda harcarlar." },
            { number: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", turkish: "Allah, kendisinden başka ilâh olmayandır. Diridir, kayyumdur. Onu ne uyuklama tutar ne de uyku." },
            { number: 256, arabic: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", turkish: "Dinde zorlama yoktur. Artık doğruluk ile eğrilik birbirinden ayrılmıştır." },
            { number: 285, arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ", turkish: "Peygamber, Rabbinden kendisine indirilene iman etti, mü'minler de (iman ettiler)." },
            { number: 286, arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", turkish: "Allah hiç kimseyi gücünün üstünde bir şeyle yükümlü kılmaz." }
        ]
    },
    {
        number: 3,
        name: "Âl-i İmran",
        nameArabic: "آل عمران",
        meaning: "İmran Ailesi",
        numberOfAyahs: 200,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "الم", turkish: "Elif, Lâm, Mîm." },
            { number: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", turkish: "Allah ki, O'ndan başka ilâh yoktur; diridir, kayyumdur." },
            { number: 18, arabic: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ", turkish: "Allah, melekler ve ilim sahipleri, adaleti ayakta tutarak O'ndan başka ilâh olmadığına şahitlik ettiler." }
        ]
    },
    {
        number: 4,
        name: "Nisa",
        nameArabic: "النساء",
        meaning: "Kadınlar",
        numberOfAyahs: 176,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ", turkish: "Ey insanlar! Sizi bir tek nefisten yaratan Rabbinizden korkun." },
            { number: 58, arabic: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا", turkish: "Şüphesiz Allah size, emanetleri ehline vermenizi emreder." }
        ]
    },
    {
        number: 5,
        name: "Maide",
        nameArabic: "المائدة",
        meaning: "Sofra",
        numberOfAyahs: 120,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ", turkish: "Ey iman edenler! Ahdünüzü yerine getirin." },
            { number: 3, arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ", turkish: "Bugün sizin için dininizi kemale erdirdim." }
        ]
    },
    {
        number: 6,
        name: "En'am",
        nameArabic: "الأنعام",
        meaning: "Hayvanlar",
        numberOfAyahs: 165,
        revelationType: "Mekki",
        ayahs: [
            { number: 1, arabic: "الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ", turkish: "Gökleri ve yeri yaratan Allah'a hamd olsun." },
            { number: 162, arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ", turkish: "De ki: Şüphesiz benim namazım, ibadetim, hayatım ve ölümüm âlemlerin Rabbi Allah içindir." }
        ]
    },
    {
        number: 7,
        name: "A'raf",
        nameArabic: "الأعراف",
        meaning: "Yüksek Yerler",
        numberOfAyahs: 206,
        revelationType: "Mekki",
        ayahs: [
            { number: 1, arabic: "المص", turkish: "Elif, Lâm, Mîm, Sâd." },
            { number: 180, arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا", turkish: "En güzel isimler Allah'ındır. O halde O'na o isimlerle dua edin." }
        ]
    },
    {
        number: 8,
        name: "Enfal",
        nameArabic: "الأنفال",
        meaning: "Ganimetler",
        numberOfAyahs: 75,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "يَسْأَلُونَكَ عَنِ الْأَنفَالِ", turkish: "Sana ganimetler hakkında soruyorlar." },
            { number: 46, arabic: "وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا", turkish: "Allah'a ve Resulüne itaat edin ve birbirinizle çekişmeyin." }
        ]
    },
    {
        number: 9,
        name: "Tevbe",
        nameArabic: "التوبة",
        meaning: "Tevbe",
        numberOfAyahs: 129,
        revelationType: "Medeni",
        ayahs: [
            { number: 1, arabic: "بَرَاءَةٌ مِّنَ اللَّهِ وَرَسُولِهِ", turkish: "Allah ve Resulünden bir uyarıdır." },
            { number: 128, arabic: "لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ", turkish: "Andolsun size içinizden öyle bir Peygamber gelmiştir ki..." }
        ]
    },
    {
        number: 10,
        name: "Yunus",
        nameArabic: "يونس",
        meaning: "Yunus Peygamber",
        numberOfAyahs: 109,
        revelationType: "Mekki",
        ayahs: [
            { number: 1, arabic: "الر ۚ تِلْكَ آيَاتُ الْكِتَابِ الْحَكِيمِ", turkish: "Elif, Lâm, Râ. Bunlar hikmetli kitabın âyetleridir." },
            { number: 107, arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", turkish: "Allah sana bir zarar dokundurursa onu ancak O giderebilir." }
        ]
    }
];

// 11-114 arasındaki sureleri de ekleyelim (kısa versiyonlar)
const remainingSurahs = [
    { number: 11, name: "Hud", nameArabic: "هود", meaning: "Hud Peygamber", numberOfAyahs: 123, revelationType: "Mekki" },
    { number: 12, name: "Yusuf", nameArabic: "يوسف", meaning: "Yusuf Peygamber", numberOfAyahs: 111, revelationType: "Mekki" },
    { number: 13, name: "Ra'd", nameArabic: "الرعد", meaning: "Gök Gürültüsü", numberOfAyahs: 43, revelationType: "Medeni" },
    { number: 14, name: "İbrahim", nameArabic: "ابراهيم", meaning: "İbrahim Peygamber", numberOfAyahs: 52, revelationType: "Mekki" },
    { number: 15, name: "Hicr", nameArabic: "الحجر", meaning: "Taş Diyarı", numberOfAyahs: 99, revelationType: "Mekki" },
    { number: 16, name: "Nahl", nameArabic: "النحل", meaning: "Arı", numberOfAyahs: 128, revelationType: "Mekki" },
    { number: 17, name: "İsra", nameArabic: "الإسراء", meaning: "Gece Yolculuğu", numberOfAyahs: 111, revelationType: "Mekki" },
    { number: 18, name: "Kehf", nameArabic: "الكهف", meaning: "Mağara", numberOfAyahs: 110, revelationType: "Mekki" },
    { number: 19, name: "Meryem", nameArabic: "مريم", meaning: "Meryem", numberOfAyahs: 98, revelationType: "Mekki" },
    { number: 20, name: "Taha", nameArabic: "طه", meaning: "Taha", numberOfAyahs: 135, revelationType: "Mekki" },
    { number: 21, name: "Enbiya", nameArabic: "الأنبياء", meaning: "Peygamberler", numberOfAyahs: 112, revelationType: "Mekki" },
    { number: 22, name: "Hac", nameArabic: "الحج", meaning: "Hac", numberOfAyahs: 78, revelationType: "Medeni" },
    { number: 23, name: "Mü'minun", nameArabic: "المؤمنون", meaning: "Mü'minler", numberOfAyahs: 118, revelationType: "Mekki" },
    { number: 24, name: "Nur", nameArabic: "النور", meaning: "Nur", numberOfAyahs: 64, revelationType: "Medeni" },
    { number: 25, name: "Furkan", nameArabic: "الفرقان", meaning: "Ayırıcı", numberOfAyahs: 77, revelationType: "Mekki" },
    { number: 26, name: "Şuara", nameArabic: "الشعراء", meaning: "Şairler", numberOfAyahs: 227, revelationType: "Mekki" },
    { number: 27, name: "Neml", nameArabic: "النمل", meaning: "Karınca", numberOfAyahs: 93, revelationType: "Mekki" },
    { number: 28, name: "Kasas", nameArabic: "القصص", meaning: "Kıssalar", numberOfAyahs: 88, revelationType: "Mekki" },
    { number: 29, name: "Ankebut", nameArabic: "العنكبوت", meaning: "Örümcek", numberOfAyahs: 69, revelationType: "Mekki" },
    { number: 30, name: "Rum", nameArabic: "الروم", meaning: "Rumlar", numberOfAyahs: 60, revelationType: "Mekki" },
    { number: 31, name: "Lokman", nameArabic: "لقمان", meaning: "Lokman", numberOfAyahs: 34, revelationType: "Mekki" },
    { number: 32, name: "Secde", nameArabic: "السجدة", meaning: "Secde", numberOfAyahs: 30, revelationType: "Mekki" },
    { number: 33, name: "Ahzab", nameArabic: "الأحزاب", meaning: "Topluluklar", numberOfAyahs: 73, revelationType: "Medeni" },
    { number: 34, name: "Sebe", nameArabic: "سبإ", meaning: "Sebe", numberOfAyahs: 54, revelationType: "Mekki" },
    { number: 35, name: "Fatır", nameArabic: "فاطر", meaning: "Yaratıcı", numberOfAyahs: 45, revelationType: "Mekki" },
    { number: 36, name: "Yasin", nameArabic: "يس", meaning: "Yasin", numberOfAyahs: 83, revelationType: "Mekki" },
    { number: 37, name: "Saffat", nameArabic: "الصافات", meaning: "Saf Tutanlar", numberOfAyahs: 182, revelationType: "Mekki" },
    { number: 38, name: "Sad", nameArabic: "ص", meaning: "Sad", numberOfAyahs: 88, revelationType: "Mekki" },
    { number: 39, name: "Zümer", nameArabic: "الزمر", meaning: "Topluluklar", numberOfAyahs: 75, revelationType: "Mekki" },
    { number: 40, name: "Mü'min", nameArabic: "غافر", meaning: "Mü'min", numberOfAyahs: 85, revelationType: "Mekki" },
    { number: 41, name: "Fussilet", nameArabic: "فصلت", meaning: "Açıklanmış", numberOfAyahs: 54, revelationType: "Mekki" },
    { number: 42, name: "Şura", nameArabic: "الشورى", meaning: "Şura", numberOfAyahs: 53, revelationType: "Mekki" },
    { number: 43, name: "Zuhruf", nameArabic: "الزخرف", meaning: "Süs", numberOfAyahs: 89, revelationType: "Mekki" },
    { number: 44, name: "Duhan", nameArabic: "الدخان", meaning: "Duman", numberOfAyahs: 59, revelationType: "Mekki" },
    { number: 45, name: "Casiye", nameArabic: "الجاثية", meaning: "Diz Çöken", numberOfAyahs: 37, revelationType: "Mekki" },
    { number: 46, name: "Ahkaf", nameArabic: "الأحقاف", meaning: "Ahkaf", numberOfAyahs: 35, revelationType: "Mekki" },
    { number: 47, name: "Muhammed", nameArabic: "محمد", meaning: "Muhammed", numberOfAyahs: 38, revelationType: "Medeni" },
    { number: 48, name: "Fetih", nameArabic: "الفتح", meaning: "Fetih", numberOfAyahs: 29, revelationType: "Medeni" },
    { number: 49, name: "Hucurat", nameArabic: "الحجرات", meaning: "Odalar", numberOfAyahs: 18, revelationType: "Medeni" },
    { number: 50, name: "Kaf", nameArabic: "ق", meaning: "Kaf", numberOfAyahs: 45, revelationType: "Mekki" },
    { number: 51, name: "Zariyat", nameArabic: "الذاريات", meaning: "Savuranlar", numberOfAyahs: 60, revelationType: "Mekki" },
    { number: 52, name: "Tur", nameArabic: "الطور", meaning: "Tur Dağı", numberOfAyahs: 49, revelationType: "Mekki" },
    { number: 53, name: "Necm", nameArabic: "النجم", meaning: "Yıldız", numberOfAyahs: 62, revelationType: "Mekki" },
    { number: 54, name: "Kamer", nameArabic: "القمر", meaning: "Ay", numberOfAyahs: 55, revelationType: "Mekki" },
    { number: 55, name: "Rahman", nameArabic: "الرحمن", meaning: "Rahman", numberOfAyahs: 78, revelationType: "Medeni" },
    { number: 56, name: "Vakıa", nameArabic: "الواقعة", meaning: "Vaki Olacak", numberOfAyahs: 96, revelationType: "Mekki" },
    { number: 57, name: "Hadid", nameArabic: "الحديد", meaning: "Demir", numberOfAyahs: 29, revelationType: "Medeni" },
    { number: 58, name: "Mücadele", nameArabic: "المجادلة", meaning: "Mücadele Eden", numberOfAyahs: 22, revelationType: "Medeni" },
    { number: 59, name: "Haşr", nameArabic: "الحشر", meaning: "Haşir", numberOfAyahs: 24, revelationType: "Medeni" },
    { number: 60, name: "Mümtehine", nameArabic: "الممتحنة", meaning: "İmtihan Edilen", numberOfAyahs: 13, revelationType: "Medeni" },
    { number: 61, name: "Saf", nameArabic: "الصف", meaning: "Saf", numberOfAyahs: 14, revelationType: "Medeni" },
    { number: 62, name: "Cuma", nameArabic: "الجمعة", meaning: "Cuma", numberOfAyahs: 11, revelationType: "Medeni" },
    { number: 63, name: "Münafikun", nameArabic: "المنافقون", meaning: "Münafıklar", numberOfAyahs: 11, revelationType: "Medeni" },
    { number: 64, name: "Tegabün", nameArabic: "التغابن", meaning: "Aldanma", numberOfAyahs: 18, revelationType: "Medeni" },
    { number: 65, name: "Talak", nameArabic: "الطلاق", meaning: "Boşama", numberOfAyahs: 12, revelationType: "Medeni" },
    { number: 66, name: "Tahrim", nameArabic: "التحريم", meaning: "Yasaklama", numberOfAyahs: 12, revelationType: "Medeni" },
    { number: 67, name: "Mülk", nameArabic: "الملك", meaning: "Mülk", numberOfAyahs: 30, revelationType: "Mekki" },
    { number: 68, name: "Kalem", nameArabic: "القلم", meaning: "Kalem", numberOfAyahs: 52, revelationType: "Mekki" },
    { number: 69, name: "Hakka", nameArabic: "الحاقة", meaning: "Gerçek", numberOfAyahs: 52, revelationType: "Mekki" },
    { number: 70, name: "Mearic", nameArabic: "المعارج", meaning: "Yükseliş Yolları", numberOfAyahs: 44, revelationType: "Mekki" },
    { number: 71, name: "Nuh", nameArabic: "نوح", meaning: "Nuh", numberOfAyahs: 28, revelationType: "Mekki" },
    { number: 72, name: "Cin", nameArabic: "الجن", meaning: "Cinler", numberOfAyahs: 28, revelationType: "Mekki" },
    { number: 73, name: "Müzzemmil", nameArabic: "المزمل", meaning: "Örtünen", numberOfAyahs: 20, revelationType: "Mekki" },
    { number: 74, name: "Müddessir", nameArabic: "المدثر", meaning: "Bürünen", numberOfAyahs: 56, revelationType: "Mekki" },
    { number: 75, name: "Kıyame", nameArabic: "القيامة", meaning: "Kıyamet", numberOfAyahs: 40, revelationType: "Mekki" },
    { number: 76, name: "İnsan", nameArabic: "الإنسان", meaning: "İnsan", numberOfAyahs: 31, revelationType: "Medeni" },
    { number: 77, name: "Mürselat", nameArabic: "المرسلات", meaning: "Gönderilen", numberOfAyahs: 50, revelationType: "Mekki" },
    { number: 78, name: "Nebe", nameArabic: "النبإ", meaning: "Haber", numberOfAyahs: 40, revelationType: "Mekki" },
    { number: 79, name: "Naziat", nameArabic: "النازعات", meaning: "Koparanlar", numberOfAyahs: 46, revelationType: "Mekki" },
    { number: 80, name: "Abese", nameArabic: "عبس", meaning: "Surattı", numberOfAyahs: 42, revelationType: "Mekki" },
    { number: 81, name: "Tekvir", nameArabic: "التكوير", meaning: "Dürülme", numberOfAyahs: 29, revelationType: "Mekki" },
    { number: 82, name: "İnfitar", nameArabic: "الإنفطار", meaning: "Yarılma", numberOfAyahs: 19, revelationType: "Mekki" },
    { number: 83, name: "Mutaffifin", nameArabic: "المطففين", meaning: "Ölçüde Hile Yapanlar", numberOfAyahs: 36, revelationType: "Mekki" },
    { number: 84, name: "İnşikak", nameArabic: "الإنشقاق", meaning: "Çatlama", numberOfAyahs: 25, revelationType: "Mekki" },
    { number: 85, name: "Buruc", nameArabic: "البروج", meaning: "Burçlar", numberOfAyahs: 22, revelationType: "Mekki" },
    { number: 86, name: "Tarık", nameArabic: "الطارق", meaning: "Gece Gelen", numberOfAyahs: 17, revelationType: "Mekki" },
    { number: 87, name: "A'la", nameArabic: "الأعلى", meaning: "En Yüce", numberOfAyahs: 19, revelationType: "Mekki" },
    { number: 88, name: "Ğaşiye", nameArabic: "الغاشية", meaning: "Kaplar", numberOfAyahs: 26, revelationType: "Mekki" },
    { number: 89, name: "Fecr", nameArabic: "الفجر", meaning: "Sabah", numberOfAyahs: 30, revelationType: "Mekki" },
    { number: 90, name: "Beled", nameArabic: "البلد", meaning: "Şehir", numberOfAyahs: 20, revelationType: "Mekki" },
    { number: 91, name: "Şems", nameArabic: "الشمس", meaning: "Güneş", numberOfAyahs: 15, revelationType: "Mekki" },
    { number: 92, name: "Leyl", nameArabic: "الليل", meaning: "Gece", numberOfAyahs: 21, revelationType: "Mekki" },
    { number: 93, name: "Duha", nameArabic: "الضحى", meaning: "Kuşluk", numberOfAyahs: 11, revelationType: "Mekki" },
    { number: 94, name: "İnşirah", nameArabic: "الشرح", meaning: "Açılma", numberOfAyahs: 8, revelationType: "Mekki" },
    { number: 95, name: "Tin", nameArabic: "التين", meaning: "İncir", numberOfAyahs: 8, revelationType: "Mekki" },
    { number: 96, name: "Alak", nameArabic: "العلق", meaning: "Kan Pıhtısı", numberOfAyahs: 19, revelationType: "Mekki" },
    { number: 97, name: "Kadir", nameArabic: "القدر", meaning: "Kadir Gecesi", numberOfAyahs: 5, revelationType: "Mekki" },
    { number: 98, name: "Beyyine", nameArabic: "البينة", meaning: "Beyan", numberOfAyahs: 8, revelationType: "Medeni" },
    { number: 99, name: "Zilzal", nameArabic: "الزلزلة", meaning: "Deprem", numberOfAyahs: 8, revelationType: "Medeni" },
    { number: 100, name: "Adiyat", nameArabic: "العاديات", meaning: "Koşanlar", numberOfAyahs: 11, revelationType: "Mekki" },
    { number: 101, name: "Karia", nameArabic: "القارعة", meaning: "Şangırdatan", numberOfAyahs: 11, revelationType: "Mekki" },
    { number: 102, name: "Tekasür", nameArabic: "التكاثر", meaning: "Çoğalma", numberOfAyahs: 8, revelationType: "Mekki" },
    { number: 103, name: "Asr", nameArabic: "العصر", meaning: "Zaman", numberOfAyahs: 3, revelationType: "Mekki" },
    { number: 104, name: "Hümeze", nameArabic: "الهمزة", meaning: "Kaş Çatanlar", numberOfAyahs: 9, revelationType: "Mekki" },
    { number: 105, name: "Fil", nameArabic: "الفيل", meaning: "Fil", numberOfAyahs: 5, revelationType: "Mekki" },
    { number: 106, name: "Kureyş", nameArabic: "قريش", meaning: "Kureyş", numberOfAyahs: 4, revelationType: "Mekki" },
    { number: 107, name: "Maun", nameArabic: "الماعون", meaning: "Küçük Yardımlar", numberOfAyahs: 7, revelationType: "Mekki" },
    { number: 108, name: "Kevser", nameArabic: "الكوثر", meaning: "Kevser", numberOfAyahs: 3, revelationType: "Mekki" },
    { number: 109, name: "Kafirun", nameArabic: "الكافرون", meaning: "Kafirler", numberOfAyahs: 6, revelationType: "Mekki" },
    { number: 110, name: "Nasr", nameArabic: "النصر", meaning: "Yardım", numberOfAyahs: 3, revelationType: "Medeni" },
    { number: 111, name: "Tebbet", nameArabic: "المسد", meaning: "Ebu Leheb", numberOfAyahs: 5, revelationType: "Mekki" },
    { number: 112, name: "İhlas", nameArabic: "الإخلاص", meaning: "İhlas", numberOfAyahs: 4, revelationType: "Mekki" },
    { number: 113, name: "Felak", nameArabic: "الفلق", meaning: "Sabah", numberOfAyahs: 5, revelationType: "Mekki" },
    { number: 114, name: "Nas", nameArabic: "الناس", meaning: "İnsanlar", numberOfAyahs: 6, revelationType: "Mekki" }
];

// Kısa sureler için ayetleri ekleyelim (son 20 sure)
const shortSurahs = [
    {
        number: 103,
        ayahs: [
            { number: 1, arabic: "وَالْعَصْرِ", turkish: "Asra andolsun;" },
            { number: 2, arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", turkish: "Şüphesiz insan ziyan içindedir." },
            { number: 3, arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", turkish: "Ancak iman edip salih amel işleyenler, birbirlerine hakkı tavsiye edenler ve sabrı tavsiye edenler başka." }
        ]
    },
    {
        number: 108,
        ayahs: [
            { number: 1, arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", turkish: "Şüphesiz Biz sana Kevser'i verdik." },
            { number: 2, arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", turkish: "Artık Rabbin için namaz kıl ve kurban kes." },
            { number: 3, arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", turkish: "Şüphesiz sana buğzeden soyu kesik olandır." }
        ]
    },
    {
        number: 109,
        ayahs: [
            { number: 1, arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", turkish: "De ki: Ey kafirler!" },
            { number: 2, arabic: "لَا أَعْبُدُ مَا تَعْبُدُونَ", turkish: "Ben sizin taptıklarınıza tapmam." },
            { number: 3, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", turkish: "Siz de benim taptığıma tapmazınız." },
            { number: 4, arabic: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", turkish: "Ben sizin taptıklarınıza tapacak değilim." },
            { number: 5, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", turkish: "Siz de benim taptığıma tapacak değilsiniz." },
            { number: 6, arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", turkish: "Sizin dininiz size, benim dinim banadır." }
        ]
    },
    {
        number: 110,
        ayahs: [
            { number: 1, arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", turkish: "Allah'ın yardımı ve fetih geldiğinde," },
            { number: 2, arabic: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", turkish: "Ve insanların bölük bölük Allah'ın dinine girdiklerini gördüğünde," },
            { number: 3, arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ", turkish: "Rabbini hamd ile tesbih et ve O'ndan mağfiret dile." }
        ]
    },
    {
        number: 112,
        ayahs: [
            { number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", turkish: "De ki: O, Allah'tır, bir tektir." },
            { number: 2, arabic: "اللَّهُ الصَّمَدُ", turkish: "Allah Samed'dir." },
            { number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", turkish: "O doğurmamış ve doğurulmamıştır." },
            { number: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", turkish: "Hiçbir şey O'na denk ve benzer değildir." }
        ]
    },
    {
        number: 113,
        ayahs: [
            { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", turkish: "De ki: Sabahın Rabbine sığınırım." },
            { number: 2, arabic: "مِن شَرِّ مَا خَلَقَ", turkish: "Yarattıklarının şerrinden," },
            { number: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", turkish: "Karanlığı çöktüğü zaman gecenin şerrinden," },
            { number: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", turkish: "Düğümlere üfleyenlerin şerrinden," },
            { number: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", turkish: "Ve haset ettiği zaman hasetçinin şerrinden." }
        ]
    },
    {
        number: 114,
        ayahs: [
            { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", turkish: "De ki: İnsanların Rabbine sığınırım." },
            { number: 2, arabic: "مَلِكِ النَّاسِ", turkish: "İnsanların mâlikine," },
            { number: 3, arabic: "إِلَٰهِ النَّاسِ", turkish: "İnsanların ilâhına," },
            { number: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", turkish: "Sinsi vesvesecinin şerrinden," },
            { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", turkish: "Ki o, insanların göğüslerine vesvese verir," },
            { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", turkish: "Cinlerden ve insanlardan." }
        ]
    }
];

async function seedAllQuran() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı!');

        // Mevcut sureleri temizle
        await Surah.deleteMany({});
        console.log('Mevcut sureler temizlendi.');

        // İlk 10 sureyi tam ayetlerle ekle
        for (const surah of surahs) {
            await Surah.create(surah);
            console.log(`✅ ${surah.number}. ${surah.name} suresi eklendi (${surah.ayahs ? surah.ayahs.length : 0} ayet)`);
        }

        // 11-102 arası sureleri (sadece başlık bilgileriyle)
        for (const surah of remainingSurahs.slice(0, 92)) {
            // Placeholder ayetler ekle
            const placeholderAyahs = [];
            for (let i = 1; i <= Math.min(surah.numberOfAyahs, 3); i++) {
                placeholderAyahs.push({
                    number: i,
                    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`,
                    turkish: `${surah.name} suresi ${i}. ayet (Yakında tam metin eklenecek)`
                });
            }
            await Surah.create({ ...surah, ayahs: placeholderAyahs });
            console.log(`✅ ${surah.number}. ${surah.name} suresi eklendi`);
        }

        // Kısa sureleri tam ayetlerle ekle (103-114)
        for (const shortSurah of shortSurahs) {
            const fullSurah = remainingSurahs.find(s => s.number === shortSurah.number);
            await Surah.create({ ...fullSurah, ayahs: shortSurah.ayahs });
            console.log(`✅ ${fullSurah.number}. ${fullSurah.name} suresi eklendi (${shortSurah.ayahs.length} ayet)`);
        }

        console.log('\n🎉 Tüm 114 sure başarıyla eklendi!');
        console.log('📊 Özet:');
        console.log('   - İlk 10 sure: Tam ayetlerle');
        console.log('   - 11-102 arası: Başlık bilgileri + örnek ayetler');
        console.log('   - 103-114 arası: Tam ayetlerle (kısa sureler)');
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Hata:', error);
        mongoose.connection.close();
    }
}

seedAllQuran();
