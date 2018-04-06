const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
// const Conversation = require('../models/conversation'),
//       Message = require('../models/message'),
//       User = require('../models/user');

      //Messenger Index Page.
      router.get('/', middleware.isLoggedIn, (req, res) => {
        res.render('chat');
      });

      // get all messages in a single conversation
        //todo - add middleware
      router.get('/:id', (req, res) => {
        res.send('get all messages from a single conversation route')
      });

      // starting a new conversation
      router.post('/new/:recipient', (req, res) => {
        res.send('start a new conversation')
      });

      // send a reply / adding a new message to an existing conversationId
      router.post('/:id', (req, res) => {
        res.send('send a reply to a conversation')
      });

      // todo - add these routes:
        // delete a conversationId
        // update a message


module.exports = router;
