const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');

router.post('/', (req,res)=>{
    var sessionCheck = false;
    if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
        console.log(true)
        sessionCheck = true
    }
    res.send(sessionCheck);
    //user의 클래스 목록들을 받아와서 프론트로전달

});

router.post('/classCreate', (req, res) => {
    const {className} = req.body;
    let classCode = "";
    //6자리 난수 코드 생성
    for(let i = 0; i<6; i++)
    {
        let ran=Math.floor(Math.random() * 36);
        if(ran<10) {
            ran = ran + 48;
        }
        else {
            ran = ran + 87;
        }

        classCode=classCode+String.fromCharCode(ran);
    }
    const newClass = new Class({
        classCode: classCode,
        className: className,
        profID: req.user.email,
        profName: req.user.name,
    });
    newClass.save()
        .then(newClass => {
            User.findByIdAndUpdate(
                req.user._id,
                {$push: { "classList": {
                            classCode:classCode,
                            className:className,
                            profName:req.user.name
                        }}}
            )
        .then(result => {
            res.send(classCode);
        })
            console.log(req.user.name+'님이'+className+' 클래스를 생성하였습니다.'+' 클래스코드 : '+classCode);
    })
    .catch(err => console.log(err));


});


router.get('/:classCode/delete', (req, res) => {
    const {classCode} = req.params
    console.log(classCode)
    User.findbyIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
                    classCode:classCode}}}
    )
    .then(result => {
        Class.findOne({classCode: classCode}).
        then(thisclass => {
            if (thisclass){
                thisclass.remove();

                console.log(req.user.name+'님이'+className+' 클래스를 삭제하였습니다.'+' 클래스코드 : '+classCode);
                res.send(true);
            }
            else{
                res.send(false);
            }
        })

    })

});

module.exports = router;
