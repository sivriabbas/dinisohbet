const express = require('express');
const router = express.Router();
const Surah = require('../../models/Surah');
const { optionalAuth } = require('../../middleware/auth');

/**
 * @swagger
 * /quran:
 *   get:
 *     summary: Get all surahs
 *     tags: [Quran]
 *     responses:
 *       200:
 *         description: List of all surahs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Surah'
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const surahs = await Surah.find({})
            .select('number name nameArabic verseCount revelationType')
            .sort({ number: 1 });

        res.json({
            success: true,
            count: surahs.length,
            data: surahs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch surahs',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /quran/{number}:
 *   get:
 *     summary: Get surah by number
 *     tags: [Quran]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Surah number (1-114)
 *     responses:
 *       200:
 *         description: Surah with verses
 *       404:
 *         description: Surah not found
 */
router.get('/:number', optionalAuth, async (req, res) => {
    try {
        const { number } = req.params;

        // Validation
        if (number < 1 || number > 114) {
            return res.status(400).json({
                success: false,
                error: 'Invalid surah number',
                message: 'Surah number must be between 1 and 114'
            });
        }

        const surah = await Surah.findOne({ number: parseInt(number) });

        if (!surah) {
            return res.status(404).json({
                success: false,
                error: 'Surah not found'
            });
        }

        res.json({
            success: true,
            data: surah
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch surah',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /quran/{surahNumber}/{verseNumber}:
 *   get:
 *     summary: Get specific verse
 *     tags: [Quran]
 *     parameters:
 *       - in: path
 *         name: surahNumber
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: verseNumber
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specific verse
 *       404:
 *         description: Verse not found
 */
router.get('/:surahNumber/:verseNumber', optionalAuth, async (req, res) => {
    try {
        const { surahNumber, verseNumber } = req.params;

        const surah = await Surah.findOne({ number: parseInt(surahNumber) });

        if (!surah) {
            return res.status(404).json({
                success: false,
                error: 'Surah not found'
            });
        }

        const verse = surah.verses.find(v => v.number === parseInt(verseNumber));

        if (!verse) {
            return res.status(404).json({
                success: false,
                error: 'Verse not found'
            });
        }

        res.json({
            success: true,
            data: {
                surah: {
                    number: surah.number,
                    name: surah.name,
                    nameArabic: surah.nameArabic
                },
                verse
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch verse',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /quran/search:
 *   get:
 *     summary: Search in Quran
 *     tags: [Quran]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/verses', optionalAuth, async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query required'
            });
        }

        const surahs = await Surah.find({
            'verses.turkish': { $regex: q, $options: 'i' }
        });

        let results = [];
        surahs.forEach(surah => {
            surah.verses.forEach(verse => {
                if (verse.turkish.toLowerCase().includes(q.toLowerCase())) {
                    results.push({
                        surah: {
                            number: surah.number,
                            name: surah.name
                        },
                        verse
                    });
                }
            });
        });

        results = results.slice(0, parseInt(limit));

        res.json({
            success: true,
            count: results.length,
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
