const express = require('express');
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

router.put('/', middleware.isLoggedIn, function(req, res){

  console.log('Search Request: ', req.body.lookup);
  var re = new RegExp(req.body.lookup, 'i');
  User.find().or([{ 'username': { $regex: re }}, { 'email': { $regex: re }}, { 'profile.phone': { $regex: re }}]).exec(function(err, searchResults) {
      //remove current user from array
      searchResults = searchResults.filter(function(result){
        return result.member_id != req.user.member_id;
      })
      res.json(searchResults);
  });
});

module.exports = router;
