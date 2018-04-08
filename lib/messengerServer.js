 const  socketio          = require('socket.io'),
        Conversation      = require('../models/conversation'),
        Message           = require('../models/message'),
        User              = require('../models/user');

//track socket.io connections.
const users = {};

exports.listen = function (server) {
  const io = socketio.listen(server);

  io.sockets.on('connection', (socket) => {
    socket.on('new user', (data, callback) => {
     console.log('socket: user: ', data);
     if (data in users) {
      callback(false);
      } else {
        callback(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
      }
   });

    socket.on('send message', (data) => {
     console.log('server-rcvd: ', data);
     console.log('sending msg to client:');
     console.log('nick: ', data.author);
     const msgTo = data.to;
     const msgFrom = data.author;
     //get conversationID
     if (data.body.length > 0) {
       Conversation.findOne({ users: { $all: [msgTo, msgFrom] } })
       .exec((err, convo) => {
         const convoId = convo.conversationId;
         console.log('convoID: ', convoId);

         // save msg to db
         const newMsg = new Message({ conversationId: convoId, body: data.body, author: msgFrom });
         newMsg.save((msgErr) => {
           if (msgErr) throw msgErr;

           if (msgTo in users) {
             users[msgTo].emit('whisper', { body: data.body, author: socket.nickname });
           }
           if (msgFrom in users) {
             users[msgFrom].emit('whisper', { body: data.body, author: socket.nickname });
           }
        });
      });
     }
  });

    socket.on('disconnect', (data) => {
      console.log("socket disconnect: ", data);
      if (!socket.nickname) return;
      delete users[socket.nickname];
    });

    socket.on('get old msgs', (data) => {
      // get conversation from db detween two users
      Conversation.findOne({ users: { $all: [data.from, data.to] } })
      .exec((err, convo) => {
        const convoId = convo.conversationId;
        console.log('get old msgsconvoID: ', convoId);

        // fetch all msgs between two users
        const msgs = Message.find({ conversationId: convoId });
        msgs.sort('created').limit(100).sort('-created').exec((msgErr, docs) => {
          if (msgErr) throw msgErr;
          users[data.from].emit('load old msgs', docs);
        });
      });
    });
  });
};
