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

app.post('/login', (req, res) => {

	if(req.session.userId) {
		console.log('2. active session');
		res.json({status: 'AUTHENTICATED'});

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
		   { username:  req.body.username,
		     password: req.body.password,
		     options: 
		      { multiOptionalFactorEnroll: true,
		        warnBeforePasswordExpired: true } },
		  json: true 
			};

		// first request to get sessionToken and userID  
		request(options, function (error, response, body) {
			console.log('got active session', body);

		  if (body.status === 'SUCCESS') {
		    userId = body._embedded.user.id;

		  	//if (!req.session.userId) { 
		  		req.session.userId = userId;
		  		// use th sessionToken to set the session 
		  		setSession(req, res, body.sessionToken);
				//}
				// set the MFA factor ID on the session
				// send message to the login page to show the MFA box

			sendMFAs(req, res);
			
			} else if (body.status === 'MFA_ENROLL'){
				// perform the enroll in MFA steps here
				req.session.userId = body._embedded.user.id
				// need to get the factor ID before I can activate it.
				var options = { 
					method: 'POST',
				  url: oktaUrl + '/api/v1/users/'+ body._embedded.user.id +'/factors',
				  headers: 
				   { //'postman-token': '60326b07-45f7-bc5d-4b17-0dd105ac23f9',
				     'cache-control': 'no-cache',
				     'authorization': 'SSWS '+ apiKey,
				     'content-type': 'application/json',
				     'accept': 'application/json' },
				  body: { factorType: 'token:software:totp', provider: 'GOOGLE' },
				  json: true };

				request(options, function (error, response, body) {
				  if (error) throw new Error(error);

				  req.session.factorId = body.id;
				  
				  console.log('from factor enroll', body.id);

				  res.json({
				  	href: body._embedded.activation._links.qrcode.href,
				  	status: 'ENROLL'
				  });
				});




			} else {
			  // failure of the request
			  res.json({error: true});
			}
		});
	}
});

app.post('/mfaactivate', (req, res) => {

	// send post to activate here
	var options = { 
		method: 'POST',
  	url: 'https://dev-477147.oktapreview.com/api/v1/users/'+ req.session.userId +'/factors/'+ req.session.factorId +'/lifecycle/activate',
  	headers: { //'postman-token': '4c541050-5981-a846-7165-cb8f7533c8d0',
     	'cache-control': 'no-cache',
     	'authorization': 'SSWS 00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb',
     	'content-type': 'application/json',
     	'accept': 'application/json' },
  body: { passCode: req.body.mfacode },
  json: true };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  console.log('response from Activate', body);
	  res.json({status: 'SUCCESS'});
	});

});

// client sends MFA back to server for validation
app.post('/mfa', (req, res) => {

	var code = req.body.mfacode;
	console.log('4. MFA Validation: ', code);


	var options = { 
		method: 'POST',
  	url: oktaUrl+ '/api/v1/users/'+ req.session.userId +'/factors/'+ req.session.factorId +'/verify',
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
req.session.destroy();
// the above didnt work. I need to figure out how to end the session on logout
});

app.listen(port, console.log(`Server running on port ${port}`));