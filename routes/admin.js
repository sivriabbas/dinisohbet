const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const User = require('../models/User');
const Post = require('../models/Post');
const Dua = require('../models/Dua');
const AdminLog = require('../models/AdminLog');

// Dashboard
router.get('/', requireAdmin, async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalPosts: await Post.countDocuments(),
            pendingPosts: await Post.countDocuments({ isApproved: false }),
            totalDuas: await Dua.countDocuments(),
            pendingDuas: await Dua.countDocuments({ isApproved: false })
        };

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const pendingPosts = await Post.find({ isApproved: false }).populate('author').limit(10);
        const recentLogs = await AdminLog.find().populate('admin', 'username').sort({ createdAt: -1 }).limit(20);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user,
            stats,
            recentUsers,
            pendingPosts,
            recentLogs
        });
    } catch (error) {
        res.status(500).send('Error loading dashboard');
    }
});

// Users management
router.get('/users', requireAdmin, async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'User Management', user: req.session.user, users });
});

// Posts moderation
router.get('/posts', requireAdmin, async (req, res) => {
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });
    res.render('admin/posts', { title: 'Post Moderation', user: req.session.user, posts });
});

// Approve post
router.post('/posts/:id/approve', requireAdmin, async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, { isApproved: true });
    await new AdminLog({ admin: req.session.user.id, action: 'post_approve', target: req.params.id }).save();
    res.json({ success: true });
});

// Reject post
router.post('/posts/:id/reject', requireAdmin, async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, { isApproved: false });
    await new AdminLog({ admin: req.session.user.id, action: 'post_reject', target: req.params.id }).save();
    res.json({ success: true });
});

// Ban user
router.post('/users/:id/ban', requireAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isBanned: true });
    await new AdminLog({ admin: req.session.user.id, action: 'user_ban', target: req.params.id }).save();
    res.json({ success: true });
});

// Logs
router.get('/logs', requireAdmin, async (req, res) => {
    const logs = await AdminLog.find().populate('admin', 'username').sort({ createdAt: -1 }).limit(100);
    res.render('admin/logs', { title: 'Admin Logs', user: req.session.user, logs });
});

module.exports = router;
