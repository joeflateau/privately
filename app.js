var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dataAccess = require('./data/access.js')();
var moduleLoader = require('./moduleLoader.js');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var salt = 'fds5f4as6d4f3rf46';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({ 
	secret: salt,
	resave: false,
	saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

var apiRouter = express.Router();

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//       return done(null, false);
//   }
// ));

// app.use(passport.authenticate('local'));

app.use('/api', apiRouter);

var modules = moduleLoader({
	apiRouter: apiRouter,
	io: io,
	dataAccess: dataAccess
});

apiRouter.get('/modules', function(req, res){
	res.json(modules.map(function(m) { return m.name }));
});

var viewRouter = express.Router();

app.use('/', viewRouter);

viewRouter
	.get('/', function(req, res) {
		dataAccess.setting.get('companion_password', function(err, value){
			res.sendFile(!value ? "views/sign-up.html" :
				"views/logged-in.html", { root: __dirname });
		});
	})
	.post('/sign-up', function(req, res){
		var body = req.body,
			your_name = body.your_name,
			their_name = body.their_name,
			password = body.password;

		dataAccess.setting.set('companion1_name', your_name);
		dataAccess.setting.set('companion2_name', their_name);

		crypto.pbkdf2(password, salt, 4096, 512, 'sha256', function(err, key) {
			if (err) throw err;
			dataAccess.setting.set('companion_password', key.toString('hex'), function(err){
				if (err) throw err;
				res.redirect('/');
			});
		});

	});

app.use(express.static('static', {}));

http.listen(8080);
