function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err && err.code === 'P2002') {
    return res.status(409).json({ message: 'Data sudah ada.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
