const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SurveySchema = new mongoose.Schema({
  classcode: {type: String, required: true },
  SID: { type: Number },
  surveyname: { type: String, required: true },
  surveyquestion: { type: String, required:true },
  surveytype: { type: Number, required: true },
  optioncount: { type: Number, default: 1 },
  content: { type: String, required:true },
  Date: { type: Date, default:Date.now },  //설문 수행 날짜 설문 종료 시 업데이트
});

SurveySchema.plugin(AutoIncrement, {id:'SID_seq',inc_field: 'SID'});
const Survey = mongoose.model('Survey', SurveySchema);

module.exports = Survey;
