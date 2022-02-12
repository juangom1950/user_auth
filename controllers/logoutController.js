const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// Used to access the json files that we are using to simulate the Database
// This will be replace by mongo or postgress in the future.
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  //On client also delete accesToken

  // This cookie has been created when you did the authentication
  const cookies = req.cookies;
  // Verify if do we have cookies and if we have a jwt in the cookies.
  if (!cookies?.jwt) {
    // It was a successful request. No content to send back
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDb.users.find((person) => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    return res.sendStatus(204); //Succesful but not content
  }

  // Delete refreshToken in db
  const otherUsers = usersDb.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  // Set the refreshToken to blank, we are leaving the property.
  const currentUser = {...foundUser, refreshToken: ''};
  usersDb.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDb.users)
  );

  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // secure: true - only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout }