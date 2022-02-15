const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { dirname } = require("path");
require("dotenv").config();
// We are using the file system because we aren't connected to Mongo
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = usersDb.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // The Object.values() method returns an array of a given object's own enumerable property values
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values
    // It returns an array of values of the properties in the object.
    const roles = Object.values(foundUser.roles);
    // create JWTs ones we had authorize the user above.
    // This will be only saved in memeory
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      // In production it would be 5 to 15min
      { expiresIn: "30s" }
    );
    
    // refreshtoken is just to verify that you can have a new access token.
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      // In production it would be 5 to 15min
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    // We will use this in case that the user desides to logs out before the refreshtoken has expired.
    const otherUsers = usersDb.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDb.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDb.users)
    );
    // With httpOnly it will not available to javascript.
    // This cookie is set with every request
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // This is only used in production. 
      // This need to be deleted when testing with thunderclient
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // This access token is just going to live in memeory for 30s
    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
