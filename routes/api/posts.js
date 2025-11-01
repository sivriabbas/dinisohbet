const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { optionalAuth, authenticateToken } = require('../../middleware/auth');
const { createLimiter } = require('../../middleware/rateLimiter');

router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        
        const query = category ? { category, isApproved: true } : { isApproved: true };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            count: posts.length,
            total,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch posts',
            message: error.message
        });
    }
});

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar')
            .populate('comments.author', 'username avatar');

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch post',
            message: error.message
        });
    }
});

router.post('/', authenticateToken, createLimiter, async (req, res) => {
    try {
        const { title, content, category } = req.body;

        const post = new Post({
            title,
            content,
            category,
            author: req.user.id
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create post',
            message: error.message
        });
    }
});

module.exports = router;
