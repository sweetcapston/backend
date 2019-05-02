const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');

//6자리 난수 코드 생성
const CreateRandomCode = () => {
    let classCode = "";

    for(let i = 0; i<6; i++)
    {
        let ran=Math.floor(Math.random() * 36);
        if(ran<10) {
            ran = ran + 48;
        }
        else {
            ran = ran + 87;
        }

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
        profID: req.user.email,
        profName: req.user.name,
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
            profName:req.user.name
        }}}
    )
    .then(result => {
        res.send(classCode);
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
        console.log(err);
        res.send(err);
    })

    await Class.findOne({classCode: classCode})
    .then(thisclass => {
        if (thisclass){
            thisclass.remove();
            res.send(true);
        }
        else{
            console.log("클래스 코드 오류")
            res.send(false);
        }
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })

});

module.exports = router;
