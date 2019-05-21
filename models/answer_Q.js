const mongoose = require('mongoose');

const Answer_QSchema = new mongoose.Schema({
  classCode: { type: String, required: true }, 
  userID: { type: String, required: true },
  userName:{type: String, required: true },
  QID: { type: Number, required: true },
  content: [{ type: String}], // 응답 내용
  point:[{type: Number}], // 배점
  correct:[{type: String}], // 정답
});


const Answer_Q = mongoose.model('Answer_Q', Answer_QSchema);

module.exports = Answer_Q;
