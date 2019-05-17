
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');
const Question = mongoose.model('Question');
const Survey = mongoose.model('Survey');
const Answer_S= mongoose.model('Answer_S');

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
        else res.send(false);//없는 클래스접근 시도
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
    Question.find({classCode: classCode})
            .then(List => {
                res.send({questionList: List});
            })
            .catch(err=> {
                res.send(err);
            })
});

router.post('/:classCode/survey',(req,res)=>{
    let {classCode}=req.params;
    Survey.find({classCode: classCode})
        .then(List => {
            res.send({surveyList: List});
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/surveyAnswer',(req,res)=>{
    let {classCode}=req.params;
    let {userID,SID,answer,surveyType}=req.body;
    const newAnswer_S = new Answer_S({
        classCode: classCode,
        userID: userID,
        SID: SID,
        answer : answer
    });
    newAnswer_S.save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))
        .then(result=>{
            if(Number(surveyType)<3){
                let check = parseInt(answer);
                let c;
                Survey.findOne({SID:SID}).
                then(thisSurvey=>{
                    console.log(thisSurvey)
                    console.log(thisSurvey.count);
                    while (check >= 1) {
                        c = check % 10;
                        thisSurvey.count[c-1]++;
                        console.log(thisSurvey.count);
                        //thisSurvey.update({thisSurvey.count[c-1]:3})
                        check= parseInt(check / 10)
                    }
                    Survey.updateOne({SID:SID},{count:thisSurvey.count})
                        .then(result=>{
                            res.send(true)
                        })
                })
            }
        })
});


module.exports = router;
