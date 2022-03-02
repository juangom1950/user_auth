const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
});

// The first argument "Employee" is the singular name of the collection your model is for. 
// Mongoose automatically looks for the plural, lowercased version of your model name.
// In this case it would look for the  "employees" collection.
module.exports = mongoose.model('Employee', employeeSchema);