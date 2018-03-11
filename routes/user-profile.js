const express = require('express');
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// user profile
router.get('/', middleware.isLoggedIn, function(req, res){
  res.render('user-profile');
});

router.get('/:id', function(req, res){
  //find user with provided ID
  User.findOne({"member_id": req.params.id}, function(err, user){
    if(err){
      console.log(err);

    }else{
      res.render('userprofile/view', {user: user});
    }
  })
})

//user profile edit
router.put('/:id/edit', middleware.checkProfileOwnership, function(req, res){

  // console.log("id:", req.user._id);
  // console.log("facebook:", req.body.facebook);

  //find and update the user profile
  User.findOne({"_id": req.user._id}, function(err, user){
    // console.log("USER:", user);
    user.profile[0].location = req.body.location;
    user.profile[0].phone = req.body.phone;
    user.profile[0].email = req.body.email;
    user.profile[0].facebook = req.body.facebook;
    user.profile[0].twitter = req.body.twitter;
    user.profile[0].reddit = req.body.reddit;
    user.save(function(err){
      if(err){
        console.log("ERROR", err);
      }

    })
    res.json(user);

  })
});


module.exports = router;
