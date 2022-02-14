const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  // Make sure that we grab the header autorhization in upper or lowercase
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  //console.log(authHeader); // Bearer token

  // Get the token
  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);  //Invalid token
      req.user = decoded.userInfo.username;
      req.roles = decoded.userInfo.roles;
      next();
    }
  )
}

module.exports = verifyJWT
