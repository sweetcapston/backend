const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig= require('../config/passport');

// Load User model
const Class = mongoose.model('Class');

router.get('/professor', (req, res) => res.render('professor'));

router.post('/professor/classcreate', (req, res) => {
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
        profID: passport.session.email,
        profname: passport.session.name,
    });
});
