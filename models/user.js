var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var shortid = require('shortid');

var UserProfileSchema = mongoose.Schema({
  location: {
    location: {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  facebook: {
    facebook: {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  twitter: {
    twitter:  {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  snapchat: {
    snapchat: {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  instagram: {
    instagram: {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  email: {
    email:  {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  phone: {
    phone: {type: String, default: "None"},
    privacy:  {type: String, default: "private"}
  },
  reddit: {
    reddit: {type: String, default: ""},
    privacy:  {type: String, default: "private"}
  },
  github: {
    github: {type: String, default: ""},
    privacy:  {type: String, default: "private"}
  }

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
