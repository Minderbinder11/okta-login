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
	console.log('in requireloign middleware');
  if (req.session.userId) {
  	console.log('require Login approved next');
    return next();
  } else {
    res.redirect('/');
  }
}

app.all('/api/*', requireLogin);


app.get('/isAuth', ( req, res ) => {
	if (req.session.userId) {
		res.send({status: 'ACTIVE'})
	} else {
		res.send({status: 'INACTIVE'})
	}
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
app.get('/api/applinks', (req, res) => {

	getApps(req, res);
	
});


app.get('/api/groups', (req, res) => {

	req.session.isAdmin = false;

	var options = { 
		method: 'GET',
	  url: oktaUrl + '/api/v1/users/' + req.session.userId + '/groups',
	  headers: 
	   { 'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' } 
	   };

	request(options, function (error, response, body) {

	  if (error) throw new Error(error);
	 	
	 	body = JSON.parse(body);
	  console.log(body);

	  body.map(group => {
	  	
	  	if (group.profile.name === 'admin'){
	  		req.session.isAdmin = true;
	  		res.json({status: 'admin'});
	  	}
	  });

	  if (!req.session.isAdmin) {
	  	req.session.isAdmin = false;
	  	res.json({status: 'user'});
	  }

	});

});

app.get('/api/getUsers', (req, res) => {

	var options = { 
		method: 'GET',
  	url: oktaUrl + '/api/v1/users',
	  headers: 
	   { 'postman-token': 'e6336fda-22ad-e78c-14ad-f30b08c1c058',
	     'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' } };

	request(options, function (error, response, body) {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  	body = JSON.parse(body);
	  	res.json({users: body});
	  	console.log('get Users', body);
	  }
	});

app.get('/passwordreset', (req, res) => {

  // FIRST I NEED TO GET THE USERID

  var userOptions = { 
    method: 'GET',
    url: oktaUrl + '/api/v1/users',
    qs: { q: 'ceasar.chavez@example.com' },
    headers: 
     { 'cache-control': 'no-cache',
       authorization: 'SSWS 00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb',
       'content-type': 'application/json',
       accept: 'application/json' } };

  request(userOptions, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });


  if (req.session.userId) {
    // call to reser password
    var options = { 
      method: 'POST',
      url: oktaUrl + '/api/v1/users/'+ req.session.userId +'/lifecycle/reset_password',
      qs: { sendEmail: 'false' },
      headers: 
       { 'postman-token': '9ed9424d-6297-0747-d405-a019730a3df2',
         'cache-control': 'no-cache',
         authorization: 'SSWS 00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb',
         accept: 'application/json',
         'content-type': 'application/json' } };

    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
        res.json({error: error});
      } else {
      
        console.log('reset password body', body);
        res.json({
          status: 'SUCCESS',
          link: body
        });
      }
    });

  } else {
    res.json({status: 'NO_USERID'});
  }


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

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.send({logout: 'logout'});
});

app.get('/*', (req, res) => {
    res.redirect('/');
});

app.listen(port, console.log(`Server running on port ${port}`));