const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
});

// The first argument "User" is the singular name of the collection your model is for. 
// Mongoose automatically looks for the plural, lowercased version of your model name.
// In this case it would look for the  "users" collection.
module.exports = mongoose.model('User', userSchema);