const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SurveySchema = new mongoose.Schema({
  classCode: {type: String, required: true },
  SID: { type: Number },
  surveyName: { type: String, required: true },
  surveyQuestion: { type: String, required:true },
  surveyType: { type: Number, required: true },
  optionCount: { type: Number, default: 1 },
  content: { type: String, required:true },
  date: { type: Date, default:Date.now },  //설문 수행 날짜 설문 종료 시 업데이트
});

SurveySchema.plugin(AutoIncrement, {id:'SID_seq',inc_field: 'SID'});
const Survey = mongoose.model('Survey', SurveySchema);

module.exports = Survey;
