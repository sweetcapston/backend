
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');
const Question = mongoose.model('Question');


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
    .then(clas => {
        if (clas) {
            res.send(true);
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
    let classCode=req.params;
    res.send({
        questionList: Question.find().equals('classCode',classCode)
    });
})

router.post('/:classCode/questionAdd', (req,res)=>{
    const{classCode}=req.params;
    const{question,anonymous}=req.body;
    let userName;

    if(!anonymous)
        userName=req.user.userName;
    else
        userName="anonymous";

    const newQuestion=new Question({
        classCode: classCode,
        userID: req.user.email,
        userName: userName,
        question: question,
        anonymous: anonymous
    });
    newQuestion.save()
        .then(result => {
            res.send(true);
        })
            .catch(err => res.send(err));
});

module.exports = router;
