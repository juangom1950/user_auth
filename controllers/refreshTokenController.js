// const usersDb = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require('../model/User');
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // This cookie has been created when you did the authentication
  const cookies = req.cookies;
  // If do we have cookies check jwt
  // This ? is called the "Optional Chaining Operator".
  // https://www.javascripttutorial.net/es-next/javascript-optional-chaining-operator/
  if (!cookies?.jwt) {
    // 401 unauthorize
    return res.sendStatus(401);
  }
  //console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // const foundUser = usersDb.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );

  // refreshToken: refreshToken it is equal to just refreshToken.
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbiden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    // Here we are creating a new Access Token
    const accessToken = jwt.sign(
      { userInfo: {
          username: decoded.username,
          roles: roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
