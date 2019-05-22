const express = require('express');
const router = express.Router();

// Load User model
const {Class,User,Question,Survey,Answer_S,Quiz,Answer_Q}=require('../models');

const Relocate = (list1,list2,element) => {
    let list = [];
    for(let i=0;i<list1.length;i++){
        for(let j=0;j<list2.length;j++){
            if(list1[i][`${element}`]==list2[j][`${element}`]){
                list.push(list2[j])
                break;
            }
            else{
                if(j==list2.length-1)
                    list.push({None: 0})
            }
        }
    }
    return list
}


router.post('/', (req,res)=>{
    let sessionCheck = false;
    if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
        sessionCheck = true
    }
    res.send(sessionCheck);

    });


router.post('/enter', (req, res) => {
    const {classCode} = req.body;
    Class.findOne({classCode: classCode})
    .then(thisClass => {
        if (thisClass) {
            const classInput = {
                className:thisClass.className,
                profName:thisClass.profName
            };
            res.send(classInput);
        }
        else {
            res.send(false);//없는 클래스접근 시도
        }
    });
});

router.get('/:classCode/classAdd', (req, res) => {
    const {classCode} = req.params
    Class.findOne({classCode: classCode})
        .then(thisClass => {
            if (thisClass) {
                const classInput = {
                    classCode:thisClass.classCode,
                    className:thisClass.className,
                    profName:thisClass.profName
                };
                User.findByIdAndUpdate(
                    req.user._id,
                    {$push: { "classList": classInput}}
                )
                    .then(result => {
                        res.send(classInput);
                    })
            }
            else{
                res.send(false);
            }
        }).catch(err => {
        res.send(err);
    });
});

router.delete('/:classCode/delete', (req, res) => {
    const {classCode} = req.params
    User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
            classCode:classCode
        }}}
    ).then(result => {
        res.send(true)
    })
    .catch(err=> {
        res.send(err);
    })
});

router.post('/:classCode/question',(req,res)=>{
    let {classCode}=req.params;
    Question.find({classCode:classCode})
            .then(List => {
                res.send({questionList: List})
            })
            .catch(err=> {
                res.send(err);
            })
});

router.post('/:classCode/survey',(req,res)=>{
    let {classCode}=req.params;
    const {userID}=req.body;

    Survey.find({classCode: classCode})
        .then(List => {
            Answer_S.find({classCode: classCode,userID:userID}).
            then(myAnswer_S=>{
                let list;
                if(myAnswer_S.length>0) {
                    list = Relocate(List, myAnswer_S, "SID");
                }
                else{
                    list = new Array(List.length).fill({None: 0})
                }
                res.send({surveyList: List, myAnswer_S: list});
            })
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/surveyAnswer_S',(req,res)=>{
    let { answer_S } = req.body;
    const newAnswer_S = new Answer_S(answer_S);
    newAnswer_S.save();
    Survey.findOne({ SID: answer_S.SID })
        .then(thisSurvey => {
            for (let i = 0; i < answer_S.surveyType.length; i++) {
                if (Number(answer_S.surveyType[i]) < 3) {
                    let check = parseInt(answer_S.answer[i]);
                    while (check >= 1) {
                        thisSurvey.surveyList[i].count[check % 10 - 1]++;
                        check = parseInt(check / 10)
                    }
                } else{
                    thisSurvey.surveyList[i].content.push(answer_S.answer[i]);
                }
            }
            Survey.updateOne({ SID: answer_S.SID }, { surveyList: thisSurvey.surveyList })
                .then(result => {
                    res.send(true);
                })
        })
})

router.post('/:classCode/quiz',(req,res)=>{
    let {classCode}=req.params;
    const {userID}=req.body;

    Quiz.find({classCode: classCode})
        .then(List => {
            Answer_Q.find({classCode: classCode,userID:userID}).
            then(myAnswer_Q=>{
                let list;
                if(myAnswer_Q.length>0) {
                    list = Relocate(List, myAnswer_Q, "QID");
                    res.send({quizList: List, myAnswer_Q: list});
                }
                else{
                    list = new Array(List.length).fill({None : 0})
                }
                res.send({quizList: List, myAnswer_Q: list});
            })
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/quizAnswer_S',(req,res)=>{
    let { answer_Q } = req.body;
    let score = 0;
    Quiz.findOne({ QID: answer_Q.SID })
        .then(thisQuiz => {
            for (let i = 0; i < answer_Q.quizType.length; i++) {
                if (Number(answer_Q.quizType[i]) < 3) {
                    if(thisQuiz.quizList[i].correct==answer_Q.answer[i]){
                        score=score+thisQuiz.quizList[i].point;
                    }
                    let check = parseInt(answer_Q.answer[i]);
                    while (check >= 1) {
                        thisQuiz.quizList[i].count[check % 10 - 1]++;
                        check = parseInt(check / 10)
                    }
                }
                else{
                    thisQuiz.quizList[i].content.push(answer_Q.answer[i]);
                }
            }
            Quiz.updateOne({ QID: answer_Q.QID }, { quizList: thisQuiz.quizList })
                .then(result => {
                    answer_Q.score=score;
                    const newAnswer_Q = new Answer_Q(answer_Q);
                    newAnswer_Q.save();
                    res.send(true);
                })
        })
})

module.exports = router;
