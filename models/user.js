var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var shortid = require('shortid');

var UserProfileSchema = mongoose.Schema({
  location: {type: String, default: "None"},
  facebook: {type: String, default: "None"},
  twitter: {type: String, default: "None"},
  snapchat: {type: String, default: "None"},
  instagram: {type: String, default: "None"},
  email: {type: String, default: "None"},
  phone: {type: String, default: "None"},
  reddit: {type: String, default: ""},
  github: {type: String, default: ""}

});


var UserSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  member_id: {type: String, default: shortid.generate},
  avatar: {type: String, default: "default_profile.png"},
  friends: [{"member_id": String, "friend_name": String, "profile_pic": String}],
  friend_requests_recvd: [{"member_id": String, "friend_name": String, "id": String}],
  friend_requests_sent: [{"member_id": String, "friend_name": String, "id": String}],
  profile:  [UserProfileSchema]
});



UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);
