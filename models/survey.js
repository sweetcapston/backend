const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SurveySchema = new mongoose.Schema({
  classCode: {type: String, required: true },
  SID: { type: Number },
  surveyName: { type: String, required: true },  //설문 주제
  surveyList :[
    new mongoose.Schema({
          surveyQuestion: {type: String, required: true}, //설문 질문
          surveyType: {type: Number, required: true}, //설문 종류(객관식, 중복, 주관식)
          contentCount: {type: Number, default: 1}, //객관식 문항 수
          content: [{type: String}], // 문항 내용
          count: [{type: Number}] // 선택자 수//
        },{ _id: false }
    )]
  ,
  active: {type:Boolean, default:false}, // 설문 활성화
  public: {type:Boolean, default:true}, // 결과 공개 설정
  date: { type: String, default:Date.now },
});

SurveySchema.plugin(AutoIncrement, {id:'SID_seq',inc_field: 'SID'});
const Survey = mongoose.model('Survey', SurveySchema);

module.exports = Survey;
