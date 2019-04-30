const mongoose = require('mongoose');

const Answer_Schema = new mongoose.Schema({
  classcode: { type: String, required: true }, 
  userID: { type: String, required: true },
  SID: { type: Number, required: true },
  content: { type: String, required: true }
});

const Answer_S = mongoose.model('Answer_S', Answer_Schema);

module.exports = Answer_S;
