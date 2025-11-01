const express = require('express');
const router = express.Router();
const Hadith = require('../../models/Hadith');
const { optionalAuth } = require('../../middleware/auth');

/**
 * @swagger
 * /hadiths:
 *   get:
 *     summary: Get hadiths
 *     tags: [Hadiths]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by source (Buhari, Muslim, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of hadiths
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { source, limit = 20, page = 1 } = req.query;
        
        const query = source ? { source } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const hadiths = await Hadith.find(query)
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ number: 1 });

        const total = await Hadith.countDocuments(query);

        res.json({
            success: true,
            count: hadiths.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: hadiths
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hadiths',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /hadiths/{id}:
 *   get:
 *     summary: Get hadith by ID
 *     tags: [Hadiths]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hadith details
 *       404:
 *         description: Hadith not found
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const hadith = await Hadith.findById(req.params.id);

        if (!hadith) {
            return res.status(404).json({
                success: false,
                error: 'Hadith not found'
            });
        }

        res.json({
            success: true,
            data: hadith
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hadith',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /hadiths/search:
 *   get:
 *     summary: Search hadiths
 *     tags: [Hadiths]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/query', optionalAuth, async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query required'
            });
        }

        const hadiths = await Hadith.find({
            $or: [
                { turkish: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        }).limit(parseInt(limit));

        res.json({
            success: true,
            count: hadiths.length,
            data: hadiths
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
