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

function requireLogin(req, res, next) {
  if (req.session.userId) {
  	console.log(req.session);
    next(); // allow the next route to run
  } else {
    // require the user to log in
    console.log('cant get MFA');
    res.redirect('/'); // or render a form, etc.
  }
}

// this should secure all routes to make sure the user has
// a active session.

app.all('/api', requireLogin, (req, res, next) => {
	next();
});


//app.get('/', express.static(path.join(__dirname + '/../client')));

app.post('/login', (req, res) => {

	if(req.session.userId) {
		console.log('active session');
		// at this point I should send e message to the app to have it 
		// divert to the logged in page.

	} else {
		console.log('NO ACTIVE SESSION');
	}

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
		// cookies????			
	  if(req.cookie)
			console.log(req.cookie['mfa-id']);

  if (body.status === 'SUCCESS') {
    userId = body._embedded.user.id;

	  // if there currently isnt a session set on the server
	  // set the userID and get the session info
	  // may have to move this into the MFA part
  	if (!req.session.userId) { 
  		req.session.userId = userId;
  		setSession(req, res, body.sessionToken);
		} else {
			req.session.views ++;
		}
			//console.log(req.session);
			sendMFAs(req, res);
			console.log('factor ID in login', req.session.factorId);
	  } else {
	  	res.json({error: true});
	  }
	});

});


app.post('/mfa', (req, res) => {

	var code = req.body.mfacode;
	console.log('code: ', code);
	console.log('userId: ', userId);
	console.log('factorId: ', req.session.factorId);


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

app.listen(port, console.log(`Server running on port ${port}`));