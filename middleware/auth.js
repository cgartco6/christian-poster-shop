function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) return next();
  res.status(403).send('Admin access required');
}

module.exports = { ensureAuthenticated, ensureAdmin };
