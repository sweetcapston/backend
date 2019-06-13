const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const QuestionSchema = new mongoose.Schema({
  classCode: { type: String, require: true },
  QesID: { type: Number },
  userID: { type: String, required: true },
  studentID: { type: String, required: true },
  userName: { type: String, required: true },
  question: { type: String, required: true },
  anonymous: { type: Boolean, default:false },
  date: { type: String, required: true },
  likeList: [{type: String}]
});


QuestionSchema.plugin(AutoIncrement, {id: 'QesID_seq',inc_field: 'QesID'});
const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
