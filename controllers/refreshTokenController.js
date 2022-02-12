const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require('jsonwebtoken');
const { dirname } = require("path");
require('dotenv').config();

const handleRefreshToken = (req, res) => {
  // This cookie has been created when you did the authentication
  const cookies = req.cookies;
  // If do we have cookies check jwt
  if (!cookies?.jwt) {
    // 401 unauthorize
    return res.sendStatus(401);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = usersDb.users.find((person) => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbiden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {

      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      // Here we are creating a new Access Token
      const accessToken = jwt.sign(
        { "username": decoded.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30s'}
      );

      res.json({ accessToken })
    }
  )
  
};

module.exports = { handleRefreshToken }