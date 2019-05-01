
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

    });


router.post('/enter', (req, res) => {
    const {classCode} = req.body;
    Class.findOne({classCode: classCode}).then(clas => {
        if (clas) {
            console.log(req.user.name+'님이'+className+' 클래스에 입장하였습니다.'+' 클래스코드 : '+classCode);
            res.send(true);
        }
        else res.send(false);//없는 클래스
    });
});

router.get('/:classCode/classAdd', (req, res) => {
    const {classCode} = req.params
    console.log(classCode);
    Class.findOne({classCode: classCode}).then(thisClass => {
        if (thisClass) {
            console.log(req.user._id)
            console.log(req.user.name+' 님이'+thisClass.className+' 클래스를 할라합니당'+' 클래스코드 : '+classCode);
            User.findByIdAndUpdate(
                req.user._id,
                {$push: { "classList": {
                            classCode:thisClass.classCode,
                            className:thisClass.className,
                            profName:thisClass.profName
                        }}}
            ).then(result => {
                console.log(req.user.name+' 님이'+thisClass.className+' 클래스를 추가하였습니다.'+' 클래스코드 : '+classCode);
                res.send(true);
            })
        }
        else{
            console.log('뭐야');

        }
    });

});

router.post('/:classCode/delete', (req, res) => {
    const {classCode} = req.params
    User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
                    classCode:classCode}}}
    )
    console.log(req.user.name+'님이'+className+' 클래스를 제거하였습니다.'+' 클래스코드 : '+classCode);
});

module.exports = router;
