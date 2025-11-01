const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { optionalAuth, authenticateToken } = require('../../middleware/auth');

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -email');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            message: error.message
        });
    }
});

module.exports = router;
