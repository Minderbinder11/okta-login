// server.js

import path 				from 'path';
import express 			from 'express';
import request 			from 'request';
import bodyParser 	from 'body-parser';
import session 			from 'express-session';
import cookieParser from 'cookie-parser';

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

app.get('/', express.static(path.join(__dirname + '/../client')));

app.post('/login', (req, res) => {

	if(req.session.userId) {
		console.log('active session')
	} else {
		console.log('NO ACTIVE SESSION');
	}

	var options = { method: 'POST',
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
	  		req.session.views = 1;
	  		//console.log(body.sessionToken);

			  var dataString = '{"sessionToken": "' + body.sessionToken + '"}';
			  var options = {
			      url: 'https://dev-477147.oktapreview.com/api/v1/sessions',
			      method: 'POST',
			      headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			  },
			      body: dataString
			  };



		  	function callback(error, response, body) {

		  		console.log('in sessions callback');
		      if (!error) {
		          body = JSON.parse(body);
		          req.session.body = body;
		          console.log(body);
		      } else {
		        console.log('error: ', error);
		      }
		  	}

		  	request(options, callback);
			} else {
				req.session.views ++;
				console.log(req.session)
			}










			var factorOptions = { 
				method: 'GET',
			  url: oktaUrl + '/api/v1/users/'+ userId +'/factors',
			  headers: 
			   { 'cache-control': 'no-cache',
			     'authorization': 'SSWS '+ apiKey,
			     'content-type': 'application/json',
			     'accept': 'application/json' } };

			// second request to get MFAs     
			request(factorOptions, function (error, response, body) {
			  if (error) {
			  	//throw new Error(error);
			  	res.json({error: true});
			  } else {
			  	console.log('reply from factors: ', JSON.parse(body));
			  	if (body.length === 0) {
			  		// no MFA, send success
			  		res.json({
			  			success: 'SUCCESS',
			  			error: false,
			  			mfas: []
			  		});

			  	} else {

			  		//console.log('sending JSON, ', body);
			  		body = JSON.parse(body)
			  		factorId = body[0].id;
			  		res.json({
			  			success: 'SUCCESS',
			  			mfas: body, 
			  			error: false
			  		});

			  	}

				}
			});


	  } else {

	  	// return an error to the user
	  	res.json({error: true});
	  }
	});

});


app.post('/mfa', (req, res) => {

	var code = req.body.mfacode;
	console.log('code: ', code);
	console.log('userId: ', userId);
	console.log('factorId: ', factorId);


	var options = { 
		method: 'POST',
  	url: oktaUrl+ '/api/v1/users/'+ userId +'/factors/'+ factorId +'/verify',
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

app.listen(port, console.log(`Server running on port ${port}`));