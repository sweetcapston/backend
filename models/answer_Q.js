const mongoose = require('mongoose');

const Answer_QSchema = new mongoose.Schema({
  classCode: { type: String, required: true }, 
  userID: { type: String, required: true },
  userName:{type: String, required: true },
  QID: { type: Number, required: true },
  answer: [{ type: String}], // 응답 내용
  Type:[{type: Number}],
  score:{type: Number}, //점수
});


const Answer_Q = mongoose.model('Answer_Q', Answer_QSchema);

module.exports = Answer_Q;
