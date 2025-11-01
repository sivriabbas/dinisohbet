require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Dua = require('./models/Dua');

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

    // Örnek kullanıcılar oluştur
    console.log('Kullanıcılar oluşturuluyor...');
    const users = await User.create([
      {
        username: 'AhmetYilmaz',
        email: 'ahmet@example.com',
        password: '123456',
        bio: 'Allah rızası için paylaşım yapıyorum. Hayırlı işlerde yardımlaşalım.',
        role: 'admin'
      },
      {
        username: 'FatmaDemir',
        email: 'fatma@example.com',
        password: '123456',
        bio: 'Dini bilgilerimi paylaşmayı seviyorum. Allah kabul etsin.',
        role: 'moderator'
      },
      {
        username: 'MehmetKaya',
        email: 'mehmet@example.com',
        password: '123456',
        bio: 'İslami içerikler ve dualar paylaşıyorum.',
        role: 'user'
      },
      {
        username: 'AyseOzturk',
        email: 'ayse@example.com',
        password: '123456',
        bio: 'Hadis ve ayet paylaşımları yapıyorum.',
        role: 'user'
      },
      {
        username: 'AliCelik',
        email: 'ali@example.com',
        password: '123456',
        bio: 'Dini sohbetler ve hikayeler paylaşıyorum.',
        role: 'user'
      }
    ]);

    console.log(`${users.length} kullanıcı oluşturuldu`);

    // Örnek paylaşımlar oluştur
    console.log('Paylaşımlar oluşturuluyor...');
    const posts = await Post.create([
      // Hadis paylaşımları
      {
        title: 'Mü\'minin Ahlakı Hakkında Hadis',
        content: 'Peygamber Efendimiz (s.a.v) buyurdu: "Mü\'minlerin iman bakımından en mükemmeli, ahlakı en güzel olanıdır. Sizin en hayırlınız, hanımlarına karşı en hayırlı olanınızdır." (Tirmizi)\n\nBu hadis-i şerif bize mü\'minin en önemli özelliğinin güzel ahlak olduğunu gösteriyor. Özellikle aile içindeki davranışlarımız, imanımızın bir göstergesidir.',
        category: 'hadis',
        author: users[0]._id,
        tags: ['hadis', 'ahlak', 'aile'],
        likes: [users[1]._id, users[2]._id, users[3]._id],
        comments: [
          {
            user: users[1]._id,
            content: 'Çok güzel bir hatırlatma. Allah razı olsun.'
          },
          {
            user: users[2]._id,
            content: 'Maşallah, çok faydalı bir paylaşım.'
          }
        ],
        viewCount: 45
      },
      {
        title: 'İlim Öğrenmenin Fazileti',
        content: 'Rasulullah (s.a.v) şöyle buyurmuştur: "İlim öğrenmek her Müslüman\'a farzdır." (İbn Mace)\n\nBir başka hadiste ise: "Kim ilim öğrenmek için bir yola girerse, Allah ona cennet yolunu kolaylaştırır." (Müslim)\n\nİlim öğrenmek, hem dünya hem ahiret için en değerli yatırımdır.',
        category: 'hadis',
        author: users[1]._id,
        tags: ['hadis', 'ilim', 'öğrenme'],
        likes: [users[0]._id, users[3]._id, users[4]._id],
        viewCount: 52
      },
      // Ayet paylaşımları
      {
        title: 'Sabır ve Namaz Hakkında Ayet',
        content: 'Allah Teala buyuruyor:\n\n"Ey iman edenler! Sabır ve namazla Allah\'tan yardım isteyin. Şüphesiz Allah sabredenlerle beraberdir." (Bakara Suresi, 153)\n\nBu ayet-i kerime bize sıkıntılı anlarda sabretmenin ve namaz kılmanın önemini hatırlatıyor. Allah sabredenlerle beraberdir.',
        category: 'ayet',
        author: users[3]._id,
        tags: ['ayet', 'sabır', 'namaz'],
        likes: [users[0]._id, users[1]._id, users[2]._id, users[4]._id],
        comments: [
          {
            user: users[0]._id,
            content: 'SubhanAllah, ne güzel bir hatırlatma.'
          }
        ],
        viewCount: 67
      },
      {
        title: 'Zikir ve Kalplerin Huzuru',
        content: '"O kimseler ki iman etmişler ve kalpleri Allah\'ı anmakla huzur bulmuştur. Haberiniz olsun ki kalpler ancak Allah\'ı anmakla huzur bulur." (Ra\'d Suresi, 28)\n\nKalbimizin gerçek huzuru Allah\'ı zikretmektedir. Dünyevi meşguliyetlerin arasında Allah\'ı hatırlamak, ruhumuza huzur verir.',
        category: 'ayet',
        author: users[1]._id,
        tags: ['ayet', 'zikir', 'huzur'],
        likes: [users[2]._id, users[3]._id],
        viewCount: 38
      },
      // Sohbet paylaşımları
      {
        title: 'Namazın Manevi Boyutu',
        content: 'Namaz sadece fiziksel bir ibadet değil, aynı zamanda manevi bir yükseliştir. Namaza durduğumuzda dünya ile bağlarımızı kesip, Rabbimizle baş başa kalırız.\n\nNamaz kılarken her hareketi, her kelimeyi içten hissederek yapmak gerekir. Namazda huşu, kalbin Allah\'a yönelmesi demektir.\n\nPeygamber Efendimiz (s.a.v) namaz kılarken göğsünden kazanın kaynama sesi gelirdi. Bu, namazın nasıl tam bir teslimiyet ve huşu ile kılınması gerektiğini gösterir.',
        category: 'sohbet',
        author: users[4]._id,
        tags: ['namaz', 'ibadet', 'huşu'],
        likes: [users[0]._id, users[1]._id, users[3]._id],
        comments: [
          {
            user: users[1]._id,
            content: 'Çok güzel anlatmışsınız. Allah hepimize huşu ile namaz kılmayı nasip etsin.'
          },
          {
            user: users[3]._id,
            content: 'Maşallah, namazın önemini bir kez daha hatırladık.'
          }
        ],
        viewCount: 73
      },
      {
        title: 'Ramazan Ayının Bereketleri',
        content: 'Ramazan ayı, Müslümanların yıl boyunca en çok beklediği mübarek aydır. Bu ayda yapılan ibadetlerin sevabı kat kat artırılır.\n\nRamazan sadece oruç tutmak değil, aynı zamanda nefsi terbiye etmek, kötü alışkanlıklardan uzaklaşmak ve manevi olarak yükselmektir.\n\nKuran-ı Kerim Ramazan ayında indirilmeye başlanmıştır. Bu nedenle Ramazan, Kuran ayıdır. Bu ayda bol bol Kuran okumak gerekir.',
        category: 'sohbet',
        author: users[0]._id,
        tags: ['ramazan', 'oruç', 'kuran'],
        likes: [users[2]._id, users[4]._id],
        viewCount: 56
      },
      // Hikaye paylaşımları
      {
        title: 'Hz. Ömer\'in Adaleti',
        content: 'Hz. Ömer (r.a) bir gece şehirde dolaşırken fakir bir kadının çadırından ağlama sesleri geldiğini duydu. İçeri girdiğinde, kadının aç çocuklarını susturmak için tencerede su kaynatıp, içinde yemek varmış gibi gösterdiğini gördü.\n\nHz. Ömer hemen sarayına koştu, sırtına un ve hurma çuvalı yükledi. Yanındakiler taşımak istedi ama Hz. Ömer: "Kıyamet günü sizler benim yerime mi yük taşıyacaksınız?" dedi.\n\nKendi elleriyle un ile çorba pişirip çocukları doyurdu. Bu olay, bir liderin halkına karşı sorumluluğunun en güzel örneğidir.',
        category: 'hikaye',
        author: users[2]._id,
        tags: ['hikaye', 'sahabe', 'adalet'],
        likes: [users[0]._id, users[1]._id, users[3]._id, users[4]._id],
        comments: [
          {
            user: users[0]._id,
            content: 'SubhanAllah, ne büyük bir liderdi Hz. Ömer (r.a).'
          },
          {
            user: users[1]._id,
            content: 'Gözyaşlarımı tutamadım. Allah hepsinden razı olsun.'
          },
          {
            user: users[4]._id,
            content: 'Gerçek adalet budur işte. Ders alıyoruz.'
          }
        ],
        viewCount: 94
      },
      {
        title: 'Dört Arkadaş ve Güzel Ahlak',
        content: 'Bir gün dört arkadaş sohbet ederlerken, içlerinden biri sordu: "Sizce en güzel şey nedir?"\n\nBirincisi: "Bence en güzel şey zenginliktir" dedi.\nİkincisi: "Hayır, en güzel şey sıhhattir" dedi.\nÜçüncüsü: "İkisi de değil, en güzel şey güçtür" dedi.\n\nDördüncü arkadaş ise: "Hepiniz yanılıyorsunuz. Zenginlik gidebilir, sıhhat bozulabilir, güç elinden alınabilir. Ama güzel ahlak kalıcıdır ve seni hem dünyada hem ahirette yüceltir" dedi.\n\nPeygamberimiz (s.a.v): "Ben güzel ahlakı tamamlamak için gönderildim" buyurmuştur.',
        category: 'hikaye',
        author: users[3]._id,
        tags: ['hikaye', 'ahlak', 'ibret'],
        likes: [users[1]._id, users[2]._id],
        viewCount: 41
      },
      // Soru-Cevap
      {
        title: 'Tesbih Çekmenin Faziletleri Nelerdir?',
        content: 'Soru: Namaz sonrası tesbih çekmenin faziletleri nelerdir?\n\nCevap: Peygamber Efendimiz (s.a.v) buyurdu: "Kim her namazın arkasından 33 kere Sübhanallah, 33 kere Elhamdülillah, 33 kere Allahu Ekber derse ve yüzü tamamlamak için \'La ilahe illallahu vahdehü la şerike leh, lehül mülkü ve lehül hamdü ve hüve ala külli şey\'in kadir\' derse, denizin köpüğü kadar günahı olsa bile bağışlanır." (Müslim)\n\nTesbih çekmek:\n- Günahları bağışlatır\n- Sevap kazandırır\n- Kalbi huzura kavuşturur\n- Allah\'ı anmanın bir yoludur\n- Namazın bereketi için önemlidir',
        category: 'soru-cevap',
        author: users[1]._id,
        tags: ['tesbih', 'namaz', 'fazilet'],
        likes: [users[0]._id, users[2]._id, users[4]._id],
        comments: [
          {
            user: users[2]._id,
            content: 'Çok faydalı bilgiler. Allah razı olsun.'
          }
        ],
        viewCount: 88
      },
      {
        title: 'Cuma Günü Hangi Sureleri Okumak Sünnettir?',
        content: 'Soru: Cuma günü hangi sureleri okumak sünnettir?\n\nCevap: Peygamberimiz (s.a.v) Cuma sabahı Fecr namazında:\n- Secde Suresi (32. Sure)\n- İnsan Suresi (76. Sure - Dehr Suresi)\n\nCuma namazında ise:\n- Cuma Suresi (62. Sure)\n- Münafikun Suresi (63. Sure)\n\nveya\n\n- A\'la Suresi (87. Sure)\n- Gaşiye Suresi (88. Sure)\n\nokumayı adet edinmişlerdir.\n\nAyrıca Cuma günü Kehf Suresi (18. Sure) okumak da büyük fazilete sahiptir. Peygamberimiz (s.a.v): "Kim Cuma günü Kehf Suresini okursa, iki Cuma arası ona nur olur" buyurmuştur.',
        category: 'soru-cevap',
        author: users[0]._id,
        tags: ['cuma', 'sure', 'sünnet'],
        likes: [users[1]._id, users[3]._id],
        viewCount: 62
      },
      // Genel paylaşımlar
      {
        title: 'Şükrün Bereketi',
        content: 'Allah Teala Kuran-ı Kerim\'de buyuruyor: "Eğer şükrederseniz, elbette size nimetimi artırırım." (İbrahim, 7)\n\nŞükür, elimizdeki nimetleri koruma ve artırmanın anahtarıdır. Her sabah gözlerimizi açtığımızda, şükretmemiz gereken binlerce nimet var:\n\n- Sağlıklı bir beden\n- Görme, işitme, konuşma gibi duyular\n- Aile ve sevdiklerimiz\n- Barınak ve yiyecek\n- İman nimeti\n\nEn büyük nimet ise iman nimetidir. Allah\'ı tanımak, O\'na kulluk etmek ne büyük bir lütuftur.\n\nHer gün en az bir kere "Elhamdülillah" diyerek şükretmeyi unutmayalım.',
        category: 'genel',
        author: users[2]._id,
        tags: ['şükür', 'nimet', 'iman'],
        likes: [users[0]._id, users[1]._id, users[4]._id],
        comments: [
          {
            user: users[1]._id,
            content: 'Elhamdülillah. Allah hepimize şükreden kullar olmayı nasip etsin.'
          }
        ],
        viewCount: 51
      }
    ]);

    console.log(`${posts.length} paylaşım oluşturuldu`);

    // Gerçek dualar oluştur
    console.log('Dualar oluşturuluyor...');
    const duas = await Dua.create([
      // Sabah Duaları
      {
        title: 'Sabah Akşam Duası - Ayetel Kürsi',
        arabicText: 'اللّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        turkishText: 'Allahü la ilahe illa hüvel hayyül kayyum. La te\'huzühü sinetün ve la nevm. Lehü ma fis semavati ve ma fil ard. Men zellezi yeşfeu \'ındehü illa bi\'iznih. Ya\'lemü ma beyne eydihim ve ma halfehüm. Ve la yuhiytune bi şey\'in min \'ilmihi illa bima şa. Vesia kürsiyyühüs semavati vel ard. Ve la yeüdühü hıfzuhüma ve hüvel aliyyül aziym.',
        meaning: 'Allah, O\'ndan başka ilah yoktur. Diridir, Kayyumdur (her şeyi ayakta tutan). O\'nu ne uyuklama tutар ne de uyku. Göklerde ve yerde ne varsa hepsi O\'nundur. İzni olmadan katında kim şefaat edebilir? O, kullarının önlerindeki ve arkalarındaki her şeyi bilir. Onlar, O\'nun dilediği kadarının dışında, O\'nun ilminden hiçbir şeyi kavrayamazlar. O\'nun kürsüsü gökleri ve yeri içine alır. Onların korunması O\'na güç gelmez. O, yücedir, büyüktür.',
        category: 'sabah',
        source: 'Bakara Suresi, 255. Ayet',
        addedBy: users[0]._id,
        favorites: [users[1]._id, users[2]._id, users[3]._id],
        isApproved: true,
        viewCount: 156
      },
      {
        title: 'Sabah Duası - Hasbünallah',
        arabicText: 'حَسْبِيَ اللّهُ لا إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        turkishText: 'Hasbiyallahu la ilahe illa hüve aleyhi tevekkeltü ve hüve rabbül arşil aziym.',
        meaning: 'Allah bana yeter. O\'ndan başka ilah yoktur. Ben yalnız O\'na tevekkül ettim (güvendim). O, Arş-ı azîmin Rabbidir.',
        category: 'sabah',
        source: 'Tevbe Suresi, 129. Ayet',
        addedBy: users[1]._id,
        favorites: [users[0]._id, users[2]._id],
        isApproved: true,
        viewCount: 98
      },
      // Akşam Duaları
      {
        title: 'Akşam Duası - İhlas, Felak, Nas Sureleri',
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        turkishText: 'Kul hüvallahü ehad. Allahüs samed. Lem yelid ve lem yüled. Ve lem yekün lehü küfüven ehad.',
        meaning: 'De ki: O, Allah\'tır, bir tektir. Allah Samed\'dir (her şey O\'na muhtaçtır, O, hiçbir şeye muhtaç değildir). O, doğurmamıştır ve doğrulmamıştır. O\'nun hiçbir dengi yoktur.',
        category: 'aksam',
        source: 'İhlas Suresi',
        addedBy: users[0]._id,
        favorites: [users[1]._id, users[3]._id, users[4]._id],
        isApproved: true,
        viewCount: 124
      },
      // Yemek Duaları
      {
        title: 'Yemek Öncesi Duası',
        arabicText: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ',
        turkishText: 'Bismillahi ve ala bereketillah.',
        meaning: 'Allah\'ın adıyla ve Allah\'ın bereketi üzerine.',
        category: 'yemek',
        source: 'Hadis',
        addedBy: users[2]._id,
        favorites: [users[0]._id, users[1]._id],
        isApproved: true,
        viewCount: 87
      },
      {
        title: 'Yemek Sonrası Duası',
        arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        turkishText: 'Elhamdülillahillezi et\'amena ve sakana ve cealena müslimin.',
        meaning: 'Bizi yedirip içiren ve bizi müslüman kılan Allah\'a hamdolsun.',
        category: 'yemek',
        source: 'Ebu Davud, Tirmizi',
        addedBy: users[2]._id,
        favorites: [users[1]._id, users[3]._id],
        isApproved: true,
        viewCount: 76
      },
      // Yolculuk Duası
      {
        title: 'Yolculuğa Çıkarken Okunacak Dua',
        arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        turkishText: 'Sübhanellezi sehhara lena haza ve ma künna lehu mukrinin. Ve inna ila rabbina le münkalibun.',
        meaning: 'Bunu (taşıtı) bizim emrimize veren Allah\'ı tesbih ederim. Yoksa biz buna güç yetiremezdik. Muhakkak biz Rabbimize döneceğiz.',
        category: 'yolculuk',
        source: 'Zuhruf Suresi, 13-14. Ayetler',
        addedBy: users[3]._id,
        favorites: [users[0]._id, users[2]._id, users[4]._id],
        isApproved: true,
        viewCount: 65
      },
      // Hasta Ziyareti
      {
        title: 'Hasta İçin Dua',
        arabicText: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        turkishText: 'Ezhibil be\'se rabbe\'n-nas, işfi ente\'ş-şafi, la şifae illa şifauk, şifaen la yugadiru sakamen.',
        meaning: 'Ey insanların Rabbi! Hastalığı gider. Şifa ver. Şifa veren ancak Sensin. Öyle bir şifa ver ki, arkasından bir hastalık bırakmasın.',
        category: 'hasta',
        source: 'Buhari, Müslim',
        addedBy: users[1]._id,
        favorites: [users[0]._id, users[3]._id],
        isApproved: true,
        viewCount: 93
      },
      // Tesbihat
      {
        title: 'Tesbih - Sübhanallah ve Bihamdihi',
        arabicText: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيمِ',
        turkishText: 'Sübhanallahi ve bihamdihi, sübhanallahil aziym.',
        meaning: 'Allah\'ı hamd ile tesbih ederim. Yüce Allah\'ı tesbih ederim.',
        category: 'tesbihat',
        source: 'Buhari, Müslim',
        addedBy: users[0]._id,
        favorites: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
        isApproved: true,
        viewCount: 142
      },
      {
        title: 'Tesbih - Kelime-i Tevhid',
        arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        turkishText: 'La ilahe illallahu vahdehü la şerike leh. Lehül mülkü ve lehül hamdü ve hüve ala külli şey\'in kadir.',
        meaning: 'Allah\'tan başka ilah yoktur. O tektir, ortağı yoktur. Mülk O\'nundur, hamd O\'na mahsustur ve O her şeye kadirdir.',
        category: 'tesbihat',
        source: 'Buhari, Müslim',
        addedBy: users[1]._id,
        favorites: [users[0]._id, users[2]._id],
        isApproved: true,
        viewCount: 118
      },
      // Genel Dualar
      {
        title: 'Peygamber Efendimizin En Çok Okuduğu Dua',
        arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        turkishText: 'Rabbena atina fid dünya haseneten ve fil ahireti haseneten ve kına azabe\'n-nar.',
        meaning: 'Ey Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
        category: 'genel',
        source: 'Bakara Suresi, 201. Ayet',
        addedBy: users[0]._id,
        favorites: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
        isApproved: true,
        viewCount: 187
      },
      {
        title: 'İstiğfar Duası',
        arabicText: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        turkishText: 'Estağfirullahel aziymel lezi la ilahe illa hüvel hayyel kayyume ve etübü ileyh.',
        meaning: 'Kendisinden başka ilah olmayan, diri ve kayyum olan yüce Allah\'tan bağışlanma dilerim ve O\'na tevbe ederim.',
        category: 'genel',
        source: 'Ebu Davud, Tirmizi',
        addedBy: users[1]._id,
        favorites: [users[0]._id, users[3]._id],
        isApproved: true,
        viewCount: 134
      },
      {
        title: 'Cuma Günü Salavat',
        arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        turkishText: 'Allahümme salli ala Muhammedin ve ala ali Muhammed. Kema salleyte ala İbrahime ve ala ali İbrahim. İnneke hamidün mecid. Allahümme barik ala Muhammedin ve ala ali Muhammed. Kema barekte ala İbrahime ve ala ali İbrahim. İnneke hamidün mecid.',
        meaning: 'Allah\'ım! Muhammed\'e ve Muhammed\'in ailesine rahmet et, İbrahim\'e ve İbrahim\'in ailesine rahmet ettiğin gibi. Şüphesiz Sen övülmüş ve yüceltilmişsin. Allah\'ım! Muhammed\'e ve Muhammed\'in ailesine bereket ver, İbrahim\'e ve İbrahim\'in ailesine bereket verdiğin gibi. Şüphesiz Sen övülmüş ve yüceltilmişsin.',
        category: 'genel',
        source: 'Buhari, Müslim',
        addedBy: users[2]._id,
        favorites: [users[0]._id, users[1]._id, users[4]._id],
        isApproved: true,
        viewCount: 109
      }
    ]);

    console.log(`${duas.length} dua oluşturuldu`);

    console.log('\n✅ Veritabanı başarıyla dolduruldu!');
    console.log(`📊 Özet:`);
    console.log(`   - ${users.length} kullanıcı`);
    console.log(`   - ${posts.length} paylaşım`);
    console.log(`   - ${duas.length} dua`);
    console.log('\nTest kullanıcıları:');
    console.log('Email: ahmet@example.com - Şifre: 123456 (Admin)');
    console.log('Email: fatma@example.com - Şifre: 123456 (Moderator)');
    console.log('Email: mehmet@example.com - Şifre: 123456');
    console.log('Email: ayse@example.com - Şifre: 123456');
    console.log('Email: ali@example.com - Şifre: 123456');

  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nVeritabanı bağlantısı kapatıldı.');
  }
}

seedDatabase();
