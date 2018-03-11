const express       = require('express'),
 app              = express(),
 bodyParser       = require('body-parser'),
 mongoose         = require('mongoose'),
 flash            = require('connect-flash'),
 passport         = require('passport'),
 LocalStrategy    = require('passport-local'),
 methodOverride   = require('method-override');


 const  User      = require('./models/user');

 // .env
 require('dotenv').config();

// requiring Routes
var indexRoutes = require('./routes/index');
var userProfileRoutes = require('./routes/user-profile');
var userSearchRoutes = require('./routes/user-search');
var contactsRoutes = require('./routes/contacts');

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

// Landing
app.get('/', function(req, res){
  res.render('landing');
})

 // Start Node Server
 app.listen(process.env.SERVER_PORT, function(){
   console.log("Node-Contacts-App Server started - localhost:3000");
   console.log("ctrl-C to stop");
 });
