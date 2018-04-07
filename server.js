const express       = require('express'),
   app              = express(),
   bodyParser       = require('body-parser'),
   mongoose         = require('mongoose'),
   flash            = require('connect-flash'),
   passport         = require('passport'),
   LocalStrategy    = require('passport-local'),
   methodOverride   = require('method-override');
   //server           = require('http').createServer(app),
   // io               = require('socket.io').listen(server),

 const  User      = require('./models/user');
 const  Conversation      = require('./models/conversation');
 const  Message      = require('./models/message');

 // .env
 require('dotenv').config();

// requiring Routes
const indexRoutes = require('./routes/index');
const userProfileRoutes = require('./routes/user-profile');
const userSearchRoutes = require('./routes/user-search');
const contactsRoutes = require('./routes/contacts');
const chatRoutes = require('./routes/chat');

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()) ;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Connect to mongo DB
mongoose.connect(process.env.DB_PATH);

 // Routes
app.use('/', indexRoutes);
app.use('/user-profile', userProfileRoutes);
app.use('/user-search', userSearchRoutes);
app.use('/contacts', contactsRoutes);
app.use('/chat', chatRoutes);

// Landing
app.get('/', function(req, res){
  res.render('landing');
})



 // Start Node Server
 const server = app.listen(process.env.SERVER_PORT, function(){
   console.log("Node-Contacts-App Server started - localhost:3000");
   console.log("ctrl-C to stop");
 });

 const io               = require('socket.io').listen(server);

 //messaging stuff
 const users = {};

 io.sockets.on('connection', function(socket){

   socket.on('new user', function(data, callback) {
     console.log('socket: user: ', data);
     if (data in users){
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
    }
   });


   socket.on('send message', function(data, callback){
     console.log("server-rcvd: ", data);
     console.log("sending msg to client:");
     console.log("nick: ", socket.nickname);
     const msgTo = data.to;
     const msgFrom = data.author;
     //console.log('to: ', name);
     if (msgTo in users){
       users[msgTo].emit('whisper', { msg: data.body, nick: socket.nickname});
     }
     if (msgFrom in users){
       users[msgFrom].emit('whisper', { msg: data.body, nick: socket.nickname});
     }


     //io.sockets.emit('new message', { msg: data.body, nick: socket.nickname });

    //trim spaces before and after
    // var msg = data.trim();
    // // check first 3 chars of message of a /w and a space
    // if(msg.substr(0,3) === '/w '){
    //   //remove the /w and space
    //   msg = msg.substr(3);
    //   // find the space that splits the name and the message
    //   var ind = msg.indexOf(' ');
    //   if (ind !== -1){
    //     var name = msg.substr(0,ind);
    //     var msg = msg.substr(ind + 1);
    //     if (name in users){
    //       users[name].emit('whisper', {msg: msg, nick: socket.nickname});
    //       console.log('wisper:');
    //     }else{
    //       callback('error: enter a valid user.');
    //     }
    //   } else {
    //     callback('error: please enter a message for your wisper');
    //   }
    // }else{
    //     console.log("sending msg to client:");
    //     console.log("nick: ", socket.nickname);
    //     io.sockets.emit('new message', {msg: msg, nick: socket.nickname });
    // }
  });


  socket.on('disconnect', function(data){
    if (!socket.nickname) return;
    delete users[socket.nickname];
    // updateNicknames();
    });
  });
