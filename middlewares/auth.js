function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Por favor, inicia sesión para acceder.');
  res.redirect('/auth/login');
}

module.exports = { ensureAuthenticated };