const express = require('express');
const router = express.Router();

// Tema galerisi sayfası
router.get('/', (req, res) => {
    res.render('themes/index', {
        title: 'Tema Galerisi',
        user: req.session.user || null
    });
});

module.exports = router;
