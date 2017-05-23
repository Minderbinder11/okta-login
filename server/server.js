// server.js

import path 				from 'path';
import express 			from 'express';
import request 			from 'request';
import bodyParser 	from 'body-parser';
import session 			from 'express-session';
import cookieParser from 'cookie-parser';
import setSession 	from './utils/setSession';
import handleLogin	from './utils/handleLogin';
import getApps			from './utils/getApps';
import validateMFAs	from './utils/validateMFAs';
import activateMFAs from './utils/activateMFAs';

import middlewareActiveSession from './utils/middlewareActiveSession';

const port = process.env.port || 8000;
const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

var userId = '';
var factorId = '';

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'mt tamalpais',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// middleware to ensure user is logged in by checking the req.session.userId

function requireLogin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
}

app.all('/api', requireLogin, (req, res, next) => {

	next();

});


app.get('/isAuth', middlewareActiveSession, (req, res, next) => {

	next();

});

app.post('/login', (req, res) => {

	if(req.session.body) {

		res.json({status: 'AUTHENTICATED'});

	} else {

		handleLogin(req, res);
	}
});

app.post('/mfaactivate', (req, res) => {

	activateMFAs(req, res);

});

// client sends MFA back to server for validation
app.post('/mfa', (req, res) => {

	validateMFAs(req, res);	

});

// get list of apps client is provisioned for
app.get('/applinks', (req, res) => {

	getApps(req, res);
	
});

app.post('/adduser', (req, res) => {
	
	var username = req.body.username;
	var password = req.body.password;
	var firstName = req.body.firstname;
	var lastName = req.body.lastname;

	var options = { 
		method: 'POST',
   	url: oktaUrl + '/api/v1/users',
    qs: { activate: 'false' },
    headers: 
     {'cache-control': 'no-cache',
	    'authorization': 'SSWS '+ apiKey,
      'content-type': 'application/json',
      'accept': 'application/json' },
    body: 
     { profile: 
        { firstName: firstName,
          lastName: lastName,
          email: username, // check in client that username is an email
          login: username 
        },
       credentials: { password: { value: password } } },
    json: true 
	};

	request(options, function (error, response, body) {
	 
	  if (error) {
	  	throw new Error(error);
	  	res.json({status: error});
	  }
	  res.json({status: 'SUCCESS'});
	});

});

app.get('/api', (req, res) => {

	res.send('<p>hello there</p>');

});

app.get('/logout', (req, res) => {

	res.send({logout: 'logout'});

	req.session.destroy();

});

app.listen(port, console.log(`Server running on port ${port}`));