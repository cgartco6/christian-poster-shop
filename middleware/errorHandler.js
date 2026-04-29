function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).render('error', { message: err.message || 'Something went wrong' });
}

module.exports = errorHandler;
