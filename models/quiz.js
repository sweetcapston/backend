const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const QuizSchema = new mongoose.Schema({
  classCode: {type: String, required: true },
  QID: { type: Number },
  quizName: { type: String, default:"이름없음" },  //퀴즈 이름
  quizList :[
    new mongoose.Schema({
          quizQuestion: {type: String, required: true}, //퀴즈 질문
          quizType: {type: Number, required: true}, //퀴즈 종류(객관식, 중복, 주관식)
          contentCount: {type: Number, default: 1}, //객관식 문항 수
          content: [{type: String}], // 문항 내용
          count: [{type: Number}], // 선택자 수//
          point:[{type: Number}], // 배점
          correct:{type: String}, // 정답
          img: { data: Buffer, contentType: String } // 이미지 파일
        },{ _id: false }
    )],

  active: {type:Boolean, default:false}, // 퀴즈 활성화
  public: {type:Boolean, default:true}, // 결과 공개 설정
  date: { type: String, default:Date.now }
});

QuizSchema.plugin(AutoIncrement, {id: 'QID_seq',inc_field: 'QID'});
const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
