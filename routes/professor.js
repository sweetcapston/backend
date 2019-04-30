const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');


router.post('/classcreate', (req, res) => {
    const {classname} = req.body;
    let classcode = "";
    //6자리 난수 코드 생성
    for(let i=0;i<6;i++)
    {
        let ran=Math.floor(Math.random() * 36);
        if(ran<10) {
            ran = ran+48;
        }
        else {
            ran = ran+87;
        }
        console.log(ran);
        classcode=classcode+String.fromCharCode(ran);
    }

    const newClass = new Class({
        classcode: classcode,
        classname: classname,
        profID: req.user.email,
        profname: req.user.name,
    });
});

module.exports = router;
