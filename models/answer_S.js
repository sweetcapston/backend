const mongoose = require('mongoose');

const Answer_PSchema = new mongoose.Schema({
  classcode: { type: String, required: true }, 
  userID: { type: String, required: true },
  SID: { type: Number, required: true },
  content: { type: String, required: true }
});

const Answer_P = mongoose.model('Answer_S', Answer_PSchema);

module.exports = Answer_S;
