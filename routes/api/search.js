const express = require('express');
const router = express.Router();
const Surah = require('../../models/Surah');
const Hadith = require('../../models/Hadith');
const Dua = require('../../models/Dua');
const Post = require('../../models/Post');
const { optionalAuth } = require('../../middleware/auth');
const { searchLimiter } = require('../../middleware/rateLimiter');

router.get('/', optionalAuth, searchLimiter, async (req, res) => {
    try {
        const { q, type, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query required'
            });
        }

        const results = {};

        if (!type || type === 'quran') {
            const surahs = await Surah.find({
                'verses.turkish': { $regex: q, $options: 'i' }
            }).limit(parseInt(limit));
            
            let verses = [];
            surahs.forEach(surah => {
                surah.verses.forEach(verse => {
                    if (verse.turkish.toLowerCase().includes(q.toLowerCase())) {
                        verses.push({
                            surah: { number: surah.number, name: surah.name },
                            verse
                        });
                    }
                });
            });
            results.quran = verses.slice(0, parseInt(limit));
        }

        if (!type || type === 'hadiths') {
            results.hadiths = await Hadith.find({
                turkish: { $regex: q, $options: 'i' }
            }).limit(parseInt(limit));
        }

        if (!type || type === 'duas') {
            results.duas = await Dua.find({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { turkish: { $regex: q, $options: 'i' } }
                ]
            }).limit(parseInt(limit));
        }

        if (!type || type === 'posts') {
            results.posts = await Post.find({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } }
                ],
                isApproved: true
            }).populate('author', 'username avatar').limit(parseInt(limit));
        }

        res.json({
            success: true,
            query: q,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Search failed',
            message: error.message
        });
    }
});

module.exports = router;
