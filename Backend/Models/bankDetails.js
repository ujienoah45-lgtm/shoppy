const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, "Please provide a bank name"],
  },
  accNumber: {
    type: String,
    required: [true, "Please provide an account number"]
  },
  accName: {
    type: String,
    required: [true, "Please provide an account name"]
  }
});

const Bank = mongoose.model('Bank', bankDetailsSchema);

module.exports = Bank;