// Kullanıcı girişi kontrolü middleware
module.exports = function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login?redirect=' + req.originalUrl);
  }
  next();
};
