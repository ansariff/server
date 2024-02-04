// userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  task1: {
    type: Number,
    default: 0,
  },
  task2: {
    type: Number,
    default: 0,
  },
  task3: {
    type: Number,
    default: 0,
  },
  // Add any other fields you may need
});

const UserDetails = mongoose.model('UserDetails', userSchema);

module.exports = UserDetails;
