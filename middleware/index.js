var User = require('../models/user');
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  req.flash('error', "You need to be logged in to do that.");
  res.redirect('/login');
};



middlewareObj.checkProfileOwnership = function(req, res, next) {
      //is user logged in?
      if(req.isAuthenticated()){
        console.log('req.params.id: ', req.params.id);
        User.findById(req.params.id, function(err, foundUser){
          if(err){
            req.flash('error', 'User Profile not found');
            res.redirect('back');
          } else {
            //does user own the profile?
            if(foundUser._id.equals(req.user._id)){
              next();
            } else {
              req.flash('error', 'You do not have permission to do that');
              res.redirect('back');
            }
          }
        });
      } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
      }
    }


module.exports=middlewareObj;
