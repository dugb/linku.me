const express = require('express');
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');


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
        req.flash('success', "Welcome " + user.username);
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



// logout route
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', "Logged you out!")
  res.redirect('/');
})




module.exports = router;
