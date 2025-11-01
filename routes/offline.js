const express = require('express');
const router = express.Router();

// Offline yönetim sayfası
router.get('/', (req, res) => {
    res.render('offline/index', {
        title: 'Offline Yönetimi',
        user: req.session.user || null
    });
});

module.exports = router;
