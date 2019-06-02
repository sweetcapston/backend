const express = require('express');
const router = express.Router();

// Load User model
const {Class,User,Question,Survey,Answer_S,Quiz,Answer_Q}=require('../models');

//6자리 난수 코드 생성
const CreateRandomCode = () => {
    let classCode = "";

    for(let i = 0; i<6; i++)
    {
        let ran=Math.floor(Math.random() * 36);
        if(ran<10)
            ran = ran + 48;
        else
            ran = ran + 87;
        classCode += String.fromCharCode(ran);
    }
    return classCode
}

router.post('/classCreate', async (req, res) => {
    const {className} = req.body;
    const classCode = CreateRandomCode();
    const newClass = new Class({
        classCode: classCode,
        className: className,
        profID: req.user.userID,
        profName: req.user.userName,
    });
    await newClass.save()
        .catch(err => {
            console.log(err);
            res.send(err);
        })
    await User.findByIdAndUpdate(
        req.user._id,
        {$push: { "classList": {
                    classCode:classCode,
                    className:className,
                    profName:req.user.userName
                }}}
    )
        .then(result => {
            const classInput = {
                classCode:classCode,
                className:className,
                profName:req.user.userName
            };
            res.send(classInput);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
});

router.delete('/:classCode/delete', async(req, res) => {
    const {classCode} = req.params
    await User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
            classCode:classCode
        }}}
    )
    .catch(err => {
        res.send(err);
    })

    await Class.findOne({classCode: classCode})
    .then(thisclass => {
        if (thisclass) {
            thisclass.remove();
        }
    })
    .catch(err => {
        res.send(err);
    })
    await Question.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            res.send(err);
        })
    await Survey.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            res.send(err);
        })
    await Answer_S.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
    await Quiz.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
    await Answer_Q.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/question',(req,res)=>{
    let {classCode}=req.params;
    Question.find({classCode: classCode})
        .then(List => {
            res.send({questionList: List});
        })
        .catch(err=> {
            res.send(err);
        })

});

router.post('/:classCode/surveyAdd', (req,res)=>{
    const{survey}=req.body;
    const newSurvey=new Survey(survey);
    newSurvey.save()
    .then(result => {
        res.send(true);
    })
    .catch(err =>{ res.send(err)});
});

router.post('/:classCode/survey',(req,res)=>{
    let {classCode}=req.params;
    Survey.find({classCode: classCode})
    .then(List => {
        res.send({surveyList: List});
    })
    .catch(err=> {
        console.log(err)
    })
});

router.put('/:classCode/survey/active',(req,res)=>{
    const {SID, active} = req.body;
    Survey.updateOne({ SID: SID }, { active: !active })
    .then((result) => {
        res.send(!active);
    })
    .catch(err => {
        console.log(err);
    })
});

router.post('/:classCode/quizAdd', (req,res)=>{
    const{quiz}=req.body;
    const newQuiz=new Quiz(quiz);
    newQuiz.save()
        .then(result => {
            res.send(true);
        })
        .catch(err =>{ res.send(err)});
});

router.post('/:classCode/quiz',(req,res)=>{
    let {classCode}=req.params;
    Quiz.find({classCode: classCode})
        .then(List => {
            res.send({quizList: List});
        })
        .catch(err=> {
            console.log(err)
        })
});

router.put('/:classCode/quiz/active',(req,res)=>{
    const {QID, active} = req.body;
    Quiz.updateOne({ QID: QID }, { active: !active })
        .then((result) => {
            res.send(!active);
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;
