const express = require('express');

const router = express.Router();
const User = require('../models/user');
const Conversation = require('../models/conversation');
const middleware = require('../middleware');


//contact request route
router.get('/contact-request/:id', middleware.isLoggedIn, (req, res) => {
  //send the friend request to:
  User.findById(req.params.id, (err, potentialFriend) => {
    if (err) {
      return res.status(500).json({ error: 'error in sending contact request' });
    } else {
      //friend request sent by:
      User.findById(req.user._id, (err, sendingFriend) => {
        if (err) {
          return res.status(500).json({ error: 'error in sending contact request'});
        } else {
          potentialFriend.update({ $push: { friend_requests_recvd: { member_id: sendingFriend.member_id, friend_name: sendingFriend.username, id: sendingFriend._id } } }, (err, results) => {
            sendingFriend.update({ $push: { friend_requests_sent: { member_id: potentialFriend.member_id, friend_name: potentialFriend.username, id: potentialFriend._id } } }, (err, resluts2) => {
              if (err) {
                return res.status(500).json({ error: 'error in sending contact request' });
              } else {
                res.json(results);
              }
            });
          });
        }
      });
    }
  });
});

router.post('/accept-contact-request', middleware.isLoggedIn, (req, res) => {
  //find new contact in db
  User.findOne({ member_id: req.body.id }, (err, newFriend) => {
    if(err) {
      console.log(err);
    } else {
      // find current user in db
      User.findOne({ member_id: req.user.member_id }, (err, currentUser) => {
        if(err){
          return res.status(500).json({ error: 'error in accepting contact request' });
        } else {
          newFriend.update({ $push: { friends: { member_id: currentUser.member_id, friend_name: currentUser.username, id: currentUser._id } } }, (err, results1) => {
            if (err) {
              return res.status(500).json({ error: 'error in accepting contact request'});
            } else {
                var newContact = { member_id: newFriend.member_id, friend_name: newFriend.username, id: newFriend._id };
                currentUser.update({ $push: { friends: newContact }, $pull: { friend_requests_recvd: { id: newFriend._id } } }, (err, results2) => {
                res.json(newContact);
                //create a new Conversation in db for the two new friends
                const newConversation = new Conversation({users: [{member_id: currentUser.member_id, username: currentUser.username}, {member_id: newFriend.member_id, username: newFriend.username}]});
                newConversation.save(function(err){
                  if (err) throw err;
                });
                  })
                }
            });
          }
      });
    }
  });
});

router.post('/contact-cancel-request', middleware.isLoggedIn, (req, res) => {
  // delete the contact request from both users
  User.findOneAndUpdate({ member_id: req.body.id}, {$pull: { friend_requests_recvd: {member_id: req.user.member_id } } }, (err, data) => {
   if (err) {
     return res.status(500).json({error: 'error in deleting contact request' });
   }
   User.findOneAndUpdate({ member_id: req.user.member_id }, { $pull: { friend_requests_sent: { member_id: req.body.id } } }, (err, data) => {
     if (err) {
       return res.status(500).json({ error: 'error in deleting contact request' });
     }
     res.json(data);
   });
 });
});


router.post('/remove-contact', middleware.isLoggedIn, (req, res) => {
  // delete contact(friend) from both users
      User.findOneAndUpdate({ member_id: req.body.id}, {$pull: { friends: {member_id: req.user.member_id } } }, (err, data) => {
       if (err) {
         return res.status(500).json({ error: 'error in deleting contact' });
       }
       User.findOneAndUpdate({ member_id: req.user.member_id}, {$pull: { friends: {member_id: req.body.id}}}, (err, data) => {
         if (err) {
           return res.status(500).json({ error: 'error in deleting contact' });
         }
         res.json(data);
       });
     });
});


module.exports = router;
