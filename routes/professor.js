const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');


router.post('/classcreate', (req, res) => {
    const {classname} = req.body;
    let classcode = "";
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
        classcode = classcode + String.fromCharCode(ran);
    }
    const newClass = new Class({
        classcode: classcode,
        classname: classname,
        profID: req.user.email,
        profname: req.user.name,
    });
    newClass.save().then(newClass => {
        User.findByIdAndUpdate(
            req.user._id,
            {$push: { "classList": {
                classcode:classcode,
                classname:classname,
                profname:req.user.name
            }}}
        )
        .then(result => {
            res.send(classcode);
        })
    })
    .catch(err => console.log(err));
});
module.exports = router;
