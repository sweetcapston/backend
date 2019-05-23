const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load model
const { User } = require('../models');

module.exports = ()=> {
  passport.use(
    new LocalStrategy({ usernameField: 'userID',session: true }, (userID, password, done) => {
      // Match user
      User.findOne({
        userID: userID
      }).then(user => {
        if (!user) {
          return done(null, false);
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
