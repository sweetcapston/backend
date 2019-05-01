const mongoose = require('mongoose');

const Answer_QSchema = new mongoose.Schema({
  classCode: { type: String, required: true }, 
  userID: { type: String, required: true },
  QZID: { type: Number, required: true },
  PID: { type: Number, required: true },
  content: { type: String, required: true }
});


const Answer_Q = mongoose.model('Answer_Q', Answer_QSchema);

module.exports = Answer_Q;
