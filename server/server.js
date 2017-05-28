// server.js

import path 				 from 'path';
import express 			 from 'express';
import request 			 from 'request';
import bodyParser 	 from 'body-parser';
import session 			 from 'express-session';
import cookieParser  from 'cookie-parser';
import setSession 	 from './utils/setSession';
import handleLogin	 from './utils/handleLogin';
import validateMFAs	 from './utils/validateMFAs';
import activateMFAs  from './utils/activateMFAs';
import deleteUser 	 from './utils/deleteUser';
import getActions			from './utils/getActions';

import postActions from './utils/postActions';


//import middlewareActiveSession from './utils/middlewareActiveSession';

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

/*
 * LOGIN POST ACTIONS
 */

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

// check on this to see if this should be a post
// this is for login
app.get('/passwordreset', (req, res) => {
	getActions.passwordReset(req, res);
});


/*
 * API POST ACTIONS
 */

	app.post('/api/activateUser',(req, res) => { postActions.activateUser(req, res); });
	app.post('/api/deleteUser', (req, res) => { deleteUser(req, res); });
	app.post('/api/unsuspendUser', (req, res) => { postActions.unsuspendUser(req, res); });
	app.post('/api/suspendUser', (req, res) => { postActions.suspendUser(req, res); });
	app.post('/api/newuser', (req, res) => { postActions.newUser(req, res); });
	app.post('/api/passwordExpire', (req, res) => { postActions.passwordExpire(req, res); });

/*
 * API GET ACTIONS
 */
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

/*
 * API PUT ACTIONS
 */
	app.put('/api/updateuser', (req, res) => {
		postActions.updateUser(req, res);
	});



app.get('/logout', (req, res) => {
	req.session.destroy();
	res.send({logout: 'logout'});
});

app.get('/*', (req, res) => {
    res.redirect('/');
});

app.listen(port, console.log(`Server running on port ${port}`));