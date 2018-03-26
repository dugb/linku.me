const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// show register form
router.get('/register', function(req, res){
  res.render('register');
});

// handle sign up logic
router.post('/register', function(req, res){
  var newUser = new User({email: req.body.email, username: req.body.username, "profile": {}});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
        //console.log(err);
        return res.render('register', {'error': err.message});
      }
      passport.authenticate('local')(req, res, function(){

        //redirect to home(rooms index)
        // req.flash('success', "Welcome " + user.username);
        res.redirect('userhome');
      });
  });
});

// show login form
router.get('/login', function(req, res){
  res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate("local",
  {
    successRedirect: "userhome",
    failureRedirect: "login"
  }), function(req, res){
});

// user home
router.get('/userhome', middleware.isLoggedIn, function(req, res){
  res.render('userhome');
});

// settings
router.get('/settings', middleware.isLoggedIn, function(req, res){
  res.render('settings');
});


// logout route
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logged out!')
  res.redirect('/');
})


// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dugbdev@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'dugbdev@gmail.com',
        subject: 'LinkU.Me Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log("user1: ", user);
      req.flash('error', 'Password reset token is invalid or has expired. err1');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log("user2: ", user);
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired. err2');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dugbdev@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'dugbdev@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



module.exports = router;
