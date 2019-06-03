const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  classCode: { type: String, require: true },
  userID: { type: String, required: true },
  studentID: { type: String, required: true },
  userName: { type: String, required: true },
  question: { type: String, required: true },
  anonymous: { type: Boolean, default:false },
  date: { type: String, required: true },
  likeList: [{type: String}]
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
