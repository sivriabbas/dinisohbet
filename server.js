require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const { sanitizeInput } = require('./middleware/security');
const i18next = require('./config/i18n');
const i18nextMiddleware = require('i18next-http-middleware');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Security & Performance Middleware
app.use(helmet({
    contentSecurityPolicy: false, // EJS için devre dışı
}));
app.use(compression()); // Gzip compression
app.use(sanitizeInput); // XSS protection
app.use(i18nextMiddleware.handle(i18next)); // i18n support

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public', {
    maxAge: '1d', // 1 günlük cache
    etag: true
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'gizli-anahtar',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 hafta
  }
}));

// Global middleware - kullanıcı bilgisini tüm view'lara aktar
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.t = req.t; // i18n translation function
  res.locals.lang = req.language; // current language
  res.locals.originalUrl = req.originalUrl; // for language switcher
  res.locals.dir = req.language === 'ar' ? 'rtl' : 'ltr'; // RTL for Arabic
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const duaRoutes = require('./routes/duas');
const userRoutes = require('./routes/users');
const quranRoutes = require('./routes/quran');
const hadithRoutes = require('./routes/hadiths');
const esmaRoutes = require('./routes/esma');
const guideRoutes = require('./routes/guides');
const prayerTimesRoutes = require('./routes/prayer-times');
const searchRoutes = require('./routes/search');
const goalsRoutes = require('./routes/goals');
const notesRoutes = require('./routes/notes');
const tasbihRoutes = require('./routes/tasbih');
const ramadanRoutes = require('./routes/ramadan');
const calendarRoutes = require('./routes/calendar');
const statsRoutes = require('./routes/stats');
const themesRoutes = require('./routes/themes');
const offlineRoutes = require('./routes/offline');
const adminRoutes = require('./routes/admin');
const sitemapRoutes = require('./routes/sitemap');
const languageRoutes = require('./routes/language');
const videosRoutes = require('./routes/videos');
const qaRoutes = require('./routes/qa');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');

// API Routes
const apiRoutes = require('./routes/api');
const { specs, swaggerUi } = require('./config/swagger');

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API v1
app.use('/api/v1', apiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Sitemap
app.use('/', sitemapRoutes);

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/duas', duaRoutes);
app.use('/users', userRoutes);
app.use('/quran', quranRoutes);
app.use('/hadiths', hadithRoutes);
app.use('/esma', esmaRoutes);
app.use('/guides', guideRoutes);
app.use('/prayer-times', prayerTimesRoutes);
app.use('/search', searchRoutes);
app.use('/goals', goalsRoutes);
app.use('/notes', notesRoutes);
app.use('/tasbih', tasbihRoutes);
app.use('/ramadan', ramadanRoutes);
app.use('/calendar', calendarRoutes);
app.use('/stats', statsRoutes);
app.use('/themes', themesRoutes);
app.use('/offline', offlineRoutes);
app.use('/admin', adminRoutes);
app.use('/language', languageRoutes);
app.use('/videos', videosRoutes);
app.use('/qa', qaRoutes);
app.use('/chat', chatRoutes);

// Ana sayfa
app.get('/', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const Dua = require('./models/Dua');
    const Hadith = require('./models/Hadith');
    const Surah = require('./models/Surah');
    const Esma = require('./models/Esma');
    
    // Son paylaşımlar
    const posts = await Post.find({ isApproved: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(6);
    
    // Popüler dualar
    const popularDuas = await Dua.find({ isApproved: true })
      .sort({ viewCount: -1 })
      .limit(3);
    
    // Günün hadisi (rastgele)
    const hadithCount = await Hadith.countDocuments();
    const randomHadith = hadithCount > 0 
      ? await Hadith.findOne().skip(Math.floor(Math.random() * hadithCount))
      : null;
    
    // Günün ayeti (rastgele)
    const surahCount = await Surah.countDocuments();
    let randomAyah = null;
    if (surahCount > 0) {
      const randomSurah = await Surah.findOne().skip(Math.floor(Math.random() * surahCount));
      if (randomSurah && randomSurah.ayahs && randomSurah.ayahs.length > 0) {
        const ayah = randomSurah.ayahs[Math.floor(Math.random() * randomSurah.ayahs.length)];
        randomAyah = {
          surahName: randomSurah.name,
          surahNumber: randomSurah.number,
          ayahNumber: ayah.number,
          arabic: ayah.arabic,
          turkish: ayah.turkish
        };
      }
    }
    
    // Rastgele Esma-ül Hüsna
    const esmaCount = await Esma.countDocuments();
    const randomEsma = esmaCount > 0
      ? await Esma.findOne().skip(Math.floor(Math.random() * esmaCount))
      : null;
    
    res.render('index', { 
      posts, 
      popularDuas, 
      randomHadith, 
      randomAyah,
      randomEsma 
    });
  } catch (error) {
    console.error(error);
    res.render('index', { 
      posts: [], 
      popularDuas: [], 
      randomHadith: null, 
      randomAyah: null,
      randomEsma: null 
    });
  }
});

// Socket.io Chat
const initializeChat = require('./socket/chat');
initializeChat(io);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinisohbet')
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
      console.log(`http://localhost:${PORT}`);
      console.log(`Socket.io aktif`);
    });
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
  });
