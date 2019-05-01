const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProblemSchema = new mongoose.Schema({
  classCode: {type: String, required:true },
  QZID: { type: Number, required:true },
  PID: { type: Number },
  content: { type: String, required:true },
  answer: { type: Number, required:true },
  img: { data: Buffer, contentType: String },
});

ProblemSchema.plugin(AutoIncrement, {id:'PID_seq',inc_field: 'PID'});
const Problem = mongoose.model('Problem', ProblemSchema);

module.exports = Problem;
