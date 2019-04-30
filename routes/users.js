const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig= require('../config/passport');
// Load User model
const User = mongoose.model('User');
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Duplicate User
router.get('/duplicate/:email', (req, res) => {
  var {email} = req.params
  User.findOne({email: email}).then(user => {
    if (user) {
      console.log('이미 등록된 아이디 입니다.');
      res.send(true)
    }
    res.send(false)
  });
})

// Register Page
router.get('/signup', (req, res) => res.render('signup'));

// Register
router.post('/signup', (req, res) => {
  const { name, email,StudentId, password } = req.body;
    const newUser = new User({
      name: name,
      StudentId: StudentId,
      email: email,
      password: password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
            .save()
            .then(user => {
              req.flash(
                  'success_msg',
                  'You are now registered and can log in'
              );
              console.log(email + '회원 등록되었습니다.');
              res.send(true);
            })
            .catch(err => console.log(err));
      });
    });
    console.log("new user signed up!");
});
passportConfig();

// Login
router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      res.send(req.session.passport.user);
      console.log(req.user.email);
});

// Logout
router.get('/logout', (req, res) => {
  delete req.session.token;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//autologin
router.get('/', (req,res)=>{
  // let classcode = "";
  // for(let i=0;i<6;i++)
  // {
  //   let ran=Math.floor(Math.random() * 36);
  //   if(ran<10) {
  //     ran = ran+48;
  //   }
  //   else {
  //     ran = ran+87;
  //   }
  //   console.log(ran);
  //   classcode=classcode+String.fromCharCode(ran);
  // }
  // console.log(classcode);

  console.log('세션이메일 : '+req.user);
  //console.log(req.headers.authorization);
  if(req.headers.authorization==null){
    console.log('로그인 중');
  }
});
module.exports = router;
