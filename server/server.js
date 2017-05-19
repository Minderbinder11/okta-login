// server.js

import path 				from 'path';
import express 			from 'express';
import request 			from 'request';
import bodyParser 	from 'body-parser';
import session 			from 'express-session';
import cookieParser from 'cookie-parser';
import setSession 	from './utils/setSession';
import sendMFAs 		from './utils/sendMFAs';

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
  	console.log('1. middleware approved')
    next();
  } else {
  	console.log('1. middleware not approved');
    res.redirect('/');
  }
}

// this should secure all routes to make sure the user has
// a active session.

function sessionActive(req, res, next) {
	console.log('in active session');
	if (req.session.userId) {
		console.log('session Active', req.session)
		res.send({status: 'ACTIVE'})
		next();
	} else {
				console.log('session INACTIVE', req.session)
		res.send({status: 'INACTIVE'})
		next();
	}
}

app.all('/api', requireLogin, (req, res, next) => {
	next();
});

app.get('/isAuth', sessionActive, (req, res, next) => {
	console.log('in get / ');
	next();
});

// app.get('/', (req, res) => {

// 	console.log('0.  serving file')
// 	if (req.session.userId) {
// 		console.log('0. session already exists', req.session.userId)
// 	} else {
// 		console.log('0. no session', req.session.userId);
// 		//express.static(path.join(__dirname + '/../client'));
// 		//res.sendFile(path.join(__dirname, '/../client/index.html'));
// 	}
// });

app.post('/login', (req, res) => {

	if(req.session.userId) {
		console.log('2. active session');
		res.json({status: 'AUTHENTICATED'});
		//response.data.status === 'AUTHENTICATED'
		// need to communicate to the client that result is good and can log in

	} else {
		console.log('2. NO ACTIVE SESSION');

		var options = { 
	    method: 'POST',
	    url: oktaUrl + '/api/v1/authn',
		  headers: 
		   { 'cache-control': 'no-cache',
		     'content-type': 'application/json',
		     'accept': 'application/json' },
		  body: 
		   { username:  'steinbeck@dev-477147.com',//req.body.username,
		     password: 'Barnegat01',//req.body.password,
		     options: 
		      { multiOptionalFactorEnroll: true,
		        warnBeforePasswordExpired: true } },
		  json: true };

		// first request to get sessionToken and userID  
		request(options, function (error, response, body) {

		  if (body.status === 'SUCCESS') {
		    userId = body._embedded.user.id;

		  	if (!req.session.userId) { 
		  		req.session.userId = userId;
		  		setSession(req, res, body.sessionToken);
				}
				
			sendMFAs(req, res);
			
			} else {
			  // failure of the request
			  res.json({error: true});
			}
		});
	}
});


// client sends MFA back to server for validation
app.post('/mfa', (req, res) => {

	var code = req.body.mfacode;
	console.log('4. MFA Validation: ', code);


	var options = { 
		method: 'POST',
  	url: oktaUrl+ '/api/v1/users/'+ userId +'/factors/'+ req.session.factorId +'/verify',
  	headers: { 
     	'cache-control': 'no-cache',
			'authorization': 'SSWS '+ apiKey,
     	'content-type': 'application/json',
     	'accept': 'application/json' },
	  body: { passCode: code },
	  json: true };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  res.json(body);
	});

});

app.get('/api', (req, res) => {

	console.log('in the api');
	res.send('<p>hello there</p>');
});

app.get('/logout', (req, res) => {

res.send({logout: 'logout'});
//res.session = null;
// the above didnt work. I need to figure out how to end the session on logout
});

app.listen(port, console.log(`Server running on port ${port}`));