const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const QuizSchema = new mongoose.Schema({
  classCode: { type: String, required: true },
  QZID: { type: Number },
  counter: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

QuizSchema.plugin(AutoIncrement, {id: 'QZID_seq',inc_field: 'QZID'});
const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
