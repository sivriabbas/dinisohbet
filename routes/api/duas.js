const express = require('express');
const router = express.Router();
const Dua = require('../../models/Dua');
const { optionalAuth } = require('../../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        
        const query = category ? { category } : { isApproved: true };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const duas = await Dua.find(query)
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Dua.countDocuments(query);

        res.json({
            success: true,
            count: duas.length,
            total,
            data: duas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch duas',
            message: error.message
        });
    }
});

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const dua = await Dua.findById(req.params.id);

        if (!dua) {
            return res.status(404).json({
                success: false,
                error: 'Dua not found'
            });
        }

        res.json({
            success: true,
            data: dua
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dua',
            message: error.message
        });
    }
});

module.exports = router;
