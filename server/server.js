// server.js

import path 				 from 'path';
import express 			 from 'express';
import request 			 from 'request';
import bodyParser 	 from 'body-parser';
import session 			 from 'express-session';
import cookieParser  from 'cookie-parser';
import setSession 	 from './utils/setSession';
import handleLogin	 from './utils/handleLogin';
//import getApps			 from './utils/getApps';
import validateMFAs	 from './utils/validateMFAs';
import activateMFAs  from './utils/activateMFAs';
import deleteUser 	 from './utils/deleteUser';
//import getUsers			 from './utils/getUsers';
import getActions			 from './utils/getActions';
import unsuspendUser from './utils/unsuspendUser';


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
	getActions.getApps(req, res);
});


app.get('/api/groups', (req, res) => {
	getActions.getGroups(req, res);
});


app.get('/api/getUsers', (req, res) => {
	getActions.getUsers(req, res);
});


app.get('/api/getUser/:userId', (req, res) => {
	getActions.getAUser(req,res);
});

app.post('/api/deleteUser', (req, res) => {
	deleteUser(req, res);
});

app.post('/api/unsuspendUser', (req, res) => {

	console.log('UNSUSPENND - user ID', req.body.userId);  

	var options = { method: 'POST',
	  url: oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/unsuspend',
	  headers: 
	   { 'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
	     'accept': 'application/json',
	     'content-type': 'application/json' } };

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  res.json({status: 'SUCCESS'});
		}
	});
});


app.post('/api/suspendUser', (req, res) => {

});

app.post('/api/newuser', (req, res) => {

	var options = { 
		method: 'POST',
	  url: oktaUrl + '/api/v1/users',
	  qs: { activate: 'true' },
	  headers: 
	   { 'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' },
	  body: 
	   { profile: 
	      { firstName: req.body.firstName,
	        lastName: req.body.lastName,
	        email: req.body.email,
	        login: req.body.username,
	        streetAddress: req.body.address,
	        city: req.body.city,
	        state: req.body.state,
	        zipCode: req.body.zip

	         },
	     credentials: { password: { value: req.body.password } } },
	  json: true };

	request(options, function (error, response, body) {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error})
	  } else {
	  	res.json({status: 'SUCCESS'});
	  	console.log(body);
	  }
	});

});


app.put('/api/updateuser', (req, res) => {

	console.log('req.body', req.body);
	var userId = req.body.userId;
	var obj = req.body;
	delete obj.userId;


	var options = { 
		method: 'POST',
	  url: oktaUrl + '/api/v1/users/' + userId,
	  headers: 
	   { 'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' },
	  body: 
	   { profile: obj},
	  	json: true 
	  };

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error})
	  } else {
	  	res.json({status: 'SUCCESS'});
	  	console.log(body);
	  }
	});

});


app.get('/passwordreset', (req, res) => {

  // FIRST I NEED TO GET THE USERID

console.log('emails for reset', req.query.email)

  var userOptions = { 
    method: 'GET',
    url: oktaUrl + '/api/v1/users',
    qs: { q: req.query.email },
    headers: 
     { 'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
       'content-type': 'application/json',
       'accept': 'application/json' } 
  };

  request(userOptions, function (error, response, body) {
    if (error) throw new Error(error);

    body = JSON.parse(body);
    console.log('body of get user', body);

  	var userId = body[0].id;

    var options = { 
      method: 'POST',
      url: oktaUrl + '/api/v1/users/'+ userId +'/lifecycle/reset_password',
      qs: { sendEmail: 'true' },
      headers: 
       	{ 'cache-control': 'no-cache',
		   		'authorization': 'SSWS '+ apiKey,
         	'accept': 'application/json',
         	'content-type': 'application/json' } 
         };

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


  });
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