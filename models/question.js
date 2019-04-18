const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  classcode: { type: String, require: true },
  userID: { type: String, required: true },
  username: { type: String, required: true },
  question: { type: String, required: true },
  content: { type: String, required:true },
  anonymous: { type: Boolean, default:false },
  Date: { type: Date, default:Date.now }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
