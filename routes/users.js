const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig= require('../config/passport');
// Load User model
const User = mongoose.model('User');
// Login Page
router.get('/login', (req, res) => {
  res.send(true)
});

// Duplicate User
router.get('/duplicate/:email', (req, res) => {
  var {email} = req.params
  User.findOne({email: email}).then(user => {
    if (user) {
      console.log('이미 등록된 아이디 입니다.');
      res.send(true)
    }
    else res.send(false)
  });
})

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
      var Identity;
      if(req.user.StudentId == "9999")
        Identity = 2;
      else 
        Identity = 1;

      res.send({
        Identity: Identity        
      });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.send("logout");
});

//autologin
router.get('/', (req,res)=>{
  var sessionCheck = false;
  if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
    console.log(true)
    sessionCheck = true
  }
  res.send(sessionCheck);
});

module.exports = router;
