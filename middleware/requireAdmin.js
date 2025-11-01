// Admin authorization middleware
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login?returnUrl=/admin');
    }

    // Check if user is admin
    if (!req.session.user.isAdmin) {
        return res.status(403).render('error', {
            title: 'Erişim Reddedildi',
            message: 'Bu sayfaya erişim yetkiniz yok.',
            user: req.session.user
        });
    }

    next();
}

module.exports = requireAdmin;
