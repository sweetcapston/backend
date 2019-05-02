const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  classCode: { type: String, require: true },
  userID: { type: String, required: true },
  userName: { type: String, required: true },
  question: { type: String, required: true },
  anonymous: { type: Boolean, default:false },
  date: { type: Date, default:Date.now }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
