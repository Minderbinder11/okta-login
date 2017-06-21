'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _handleLogin = require('./utils/handleLogin');

var _handleLogin2 = _interopRequireDefault(_handleLogin);

var _getActions = require('./utils/getActions');

var _getActions2 = _interopRequireDefault(_getActions);

var _postActions = require('./utils/postActions');

var _postActions2 = _interopRequireDefault(_postActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import middlewareActiveSession from './utils/middlewareActiveSession';

var port = process.env.PORT || 8000; // server.js


var app = (0, _express2.default)();
app.set('host', process.env.HOST || '127.0.0.1');

app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
	secret: 'mt tamalpais',
	cookie: { maxAge: 3600000 },
	resave: false,
	saveUninitialized: false
}));

app.use(_express2.default.static('client'));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// middleware to ensure user is logged in by checking the req.session.userId

function requireLogin(req, res, next) {
	if (req.session.userId) {
		return next();
	} else {
		res.redirect('/');
	}
}

app.all('/api/*', requireLogin);

app.get('/isAuth', function (req, res) {
	if (req.session.userId) {
		res.status(200).send({ status: 'ACTIVE' });
	} else {
		res.status(200).send({ status: 'INACTIVE' });
	}
});

/*
 * LOGIN POST ACTIONS
 */

app.post('/login', function (req, res) {

	if (req.session.body) {
		res.status(200).json({ status: 'AUTHENTICATED' });
	} else {
		(0, _handleLogin2.default)(req, res);
	}
});

app.post('/register', function (req, res) {
	_postActions2.default.register(req, res);
});
app.post('/mfa', function (req, res) {
	_postActions2.default.validateMFAs(req, res);
});
app.get('/passwordreset', function (req, res) {
	_getActions2.default.passwordReset(req, res);
});

/*
 * API POST ACTIONS
 */
app.post('/api/activateUser', function (req, res) {
	_postActions2.default.activateUser(req, res);
});
app.post('/api/deleteUser', function (req, res) {
	_postActions2.default.deleteUser(req, res);
});
app.post('/api/unsuspendUser', function (req, res) {
	_postActions2.default.unsuspendUser(req, res);
});
app.post('/api/suspendUser', function (req, res) {
	_postActions2.default.suspendUser(req, res);
});
app.post('/api/newuser', function (req, res) {
	_postActions2.default.newUser(req, res);
});
app.post('/api/passwordExpire', function (req, res) {
	_postActions2.default.passwordExpire(req, res);
});
app.post('/api/deactivateUser', function (req, res) {
	_postActions2.default.deactivateUser(req, res);
});
app.post('/api/reactivateUser', function (req, res) {
	_postActions2.default.reactivateUser(req, res);
});
app.post('/api/unlockUser', function (req, res) {
	_postActions2.default.unlockUser(req, res);
});

/*
 * API GET ACTIONS
 */
app.get('/api/applinks', function (req, res) {
	_getActions2.default.getApps(req, res);
});
app.get('/api/groups', function (req, res) {
	_getActions2.default.getGroups(req, res);
});
app.get('/api/getUsers', function (req, res) {
	_getActions2.default.getUsers(req, res);
});
app.get('/api/getUser/:userId', function (req, res) {
	_getActions2.default.getUserById(req, res);
});
app.get('/api/getCurrentUser', function (req, res) {
	_getActions2.default.getAUser(req, res);
});

/*
 * API PUT ACTIONS
 */
app.put('/api/updateuser', function (req, res) {
	_postActions2.default.updateUser(req, res);
});

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.status(200).send({ logout: 'logout' });
});

app.get('/*', function (req, res) {
	res.redirect('/');
});

app.listen(port, console.log('Server running on port ' + port));