// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  age_group: {
    type: String,
    required: true
  },
  income_range: {
    type: String,
    required: true
  },
  income_allocation_needs: {
    type: String,
    required: true
  },
  income_allocation_wants: {
    type: String,
    required: true
  },
  income_allocation_investments: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
