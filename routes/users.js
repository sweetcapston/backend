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

// Register Page
router.get('/signup', (req, res) => res.render('signup'));

// Register
router.post('/signup', (req, res) => {
  const { name, email,StudentId, password, password2 } = req.body;
  let errors = [];
  console.log("sign up");
  console.log(StudentId,name, email, password);
  if (errors.length > 0) {
    res.render('signup', {
      errors,
      name,
      StudentId,
      email,
      password,
      password2
    });
  } else {
    User.findOne({email: email}).then(user => {
      console.log('asd');
      if (user) {
        console.log('이미등록된 아이디 입니다.');
        errors.push({msg: 'Email already exists'});
        res.render('singup', {
          errors,
          name,
          StudentId,
          email,
          password,
          password2
        });
      } else {
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
      }
    });
  }
  console.log("sign up");
});
passportConfig();
// Login
router.post('/login',
    passport.authenticate('local'),
    function(req, res) {

      console.log(req.user);
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.send('/users/' + req.user.name);
    });

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
