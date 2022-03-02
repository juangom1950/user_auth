// const usersDB = {
//   // This simulates the Db
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const fsPromises = require("fs").promises;
// const path = require("path");

const User = require('../model/User');
//npm i bcrypt
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate usernames in the db
  //const duplicate = usersDB.users.find((person) => person.username === user);
  // We need to use the exec() when we use the await.
  const duplicate = await User.findOne({ username: user}).exec();

  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    // 10 is the salt that we are adding
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Create and store the new user
    const result = await User.create({ 
        "username": user, 
        "password": hashedPwd 
    });

    // To see the record in the console.
    console.log(result);

    //usersDB.setUsers([...usersDB.users, newUser]);
    // // This will overwrite any existing file there
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
