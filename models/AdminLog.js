const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['user_ban', 'user_unban', 'post_approve', 'post_reject', 'post_delete', 'comment_delete', 'dua_approve', 'dua_reject', 'settings_update']
    },
    target: {
        type: String, // User ID, Post ID, etc.
        required: true
    },
    details: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;
