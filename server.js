const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override');

	const env = require('./config/env');
//server           = require('http').createServer(app),
// io               = require('socket.io').listen(server),
const messengerServer = require('./lib/messengerServer');

const User = require('./models/user');

// .env
//require('dotenv').config();

// requiring Routes
const indexRoutes = require('./routes/index');
const userProfileRoutes = require('./routes/user-profile');
const userSearchRoutes = require('./routes/user-search');
const contactsRoutes = require('./routes/contacts');
const chatRoutes = require('./routes/chat');

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		//secret: process.env.SECRET,
		secret: env.SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// Connect to mongo DB
//mongoose.connect(process.env.DB_PATH);
mongoose.connect(env.DB_PATH);

// Routes
app.use('/', indexRoutes);
app.use('/user-profile', userProfileRoutes);
app.use('/user-search', userSearchRoutes);
app.use('/contacts', contactsRoutes);
app.use('/chat', chatRoutes);

// Landing
app.get('/', function(req, res) {
	res.render('landing');
});

require('./routes/authRoutes')(app);
// Start Node Server
const server = app.listen(env.SERVER_PORT, function() {
	console.log('LinkU.Me Server started - localhost:3000');
	console.log('ctrl-C to stop');
});
messengerServer.listen(server);
