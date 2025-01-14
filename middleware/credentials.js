const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    // CORS is looking for this
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = credentials