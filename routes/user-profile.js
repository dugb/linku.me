const express = require('express');
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// view own profile
router.get('/', middleware.isLoggedIn, function(req, res){
  res.render('userprofile/view-owner');
});

// view others users profile
router.get('/:id', function(req, res){
  //find user with provided ID
  User.findOne({"member_id": req.params.id}, function(err, user){
    if(err){
      console.log(err);
    }else{

      //if a contact then we do not filter the private stuff
      if(user.friends.some(checkContact, req.user.username)){
        res.render('userprofile/view', {user: user});

      }else{ //not a contact so we need to filter the private stuff
        if (user.profile[0].location.privacy === "private") {
              user.profile[0].location.location = "private";
            };
        if (user.profile[0].facebook.privacy === "private") {
              user.profile[0].facebook.facebook = "private";
            };
        if (user.profile[0].phone.privacy === "private") {
              user.profile[0].phone.phone = "private";
            };
        if (user.profile[0].email.privacy === "private") {
              user.profile[0].email.email = "private";
            };
        if (user.profile[0].twitter.privacy === "private") {
              user.profile[0].twitter.twitter = "private";
            };
        if (user.profile[0].reddit.privacy === "private") {
              user.profile[0].reddit.reddit = "private";
            };
        if (user.profile[0].snapchat.privacy === "private") {
              user.profile[0].snapchat.snapchat = "private";
            };
        if (user.profile[0].instagram.privacy === "private") {
              user.profile[0].instagram.instagram = "private";
            };
        if (user.profile[0].github.privacy === "private") {
              user.profile[0].github.github = "private";
            };

        res.render('userprofile/view', {user: user});
      }
    }
  })
})

//user profile edit
router.put('/edit/:id', middleware.checkProfileOwnership, function(req, res){

  console.log("member_id:", req.params.id);

  //find and update the user profile
  User.findOne({"member_id": req.params.id}, function(err, user){

    user.profile[0].location.location = req.body.location;
    user.profile[0].location.privacy = req.body.locationCheckbox == undefined ? "public" : "private";
    user.profile[0].facebook.facebook = req.body.facebook;
    user.profile[0].facebook.privacy = req.body.facebookCheckbox == undefined ? "public" : "private";
    user.profile[0].phone.phone = req.body.phone;
    user.profile[0].phone.privacy = req.body.phoneCheckbox == undefined ? "public" : "private";
    user.profile[0].email.email = req.body.email;
    user.profile[0].email.privacy = req.body.emailCheckbox == undefined ? "public" : "private";
    user.profile[0].twitter.twitter = req.body.twitter;
    user.profile[0].twitter.privacy = req.body.twitterCheckbox == undefined ? "public" : "private";
    user.profile[0].reddit.reddit = req.body.reddit;
    user.profile[0].reddit.privacy = req.body.redditCheckbox == undefined ? "public" : "private";
    user.profile[0].snapchat.snapchat = req.body.snapchat;
    user.profile[0].snapchat.privacy = req.body.snapchatCheckbox == undefined ? "public" : "private";
    user.profile[0].instagram.instagram = req.body.instagram;
    user.profile[0].instagram.privacy = req.body.instagramCheckbox == undefined ? "public" : "private";
    user.profile[0].github.github = req.body.github;
    user.profile[0].github.privacy = req.body.emailCheckbox == undefined ? "public" : "private";

    console.log("USER:", user);
    user.save(function(err){
      if(err){
        console.log("ERROR", err);
      }

    })
    res.json(user);

  })
});


module.exports = router;

function checkContact(el){
  return el.friend_name == this;
}
