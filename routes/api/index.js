const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../../middleware/rateLimiter');

// Import API sub-routes
const authRoutes = require('./auth');
const quranRoutes = require('./quran');
const hadithRoutes = require('./hadiths');
const duaRoutes = require('./duas');
const postRoutes = require('./posts');
const userRoutes = require('./users');
const searchRoutes = require('./search');

// Apply rate limiting to all API routes
router.use(apiLimiter);

// API Routes
router.use('/auth', authRoutes);
router.use('/quran', quranRoutes);
router.use('/hadiths', hadithRoutes);
router.use('/duas', duaRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);

// API Info endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API information
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'DiniSohbet API v1.0',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: '/api/v1/auth',
            quran: '/api/v1/quran',
            hadiths: '/api/v1/hadiths',
            duas: '/api/v1/duas',
            posts: '/api/v1/posts',
            users: '/api/v1/users',
            search: '/api/v1/search'
        }
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
