// server.js
import path 				 	from 'path';
import express 			 	from 'express';
import request 			 	from 'request';
import bodyParser 	 	from 'body-parser';
import session 			 	from 'express-session';
import cookieParser  	from 'cookie-parser';
import handleLogin	 	from './utils/handleLogin';
import getActions			from './utils/getActions';
import postActions 		from './utils/postActions';


//import middlewareActiveSession from './utils/middlewareActiveSession';

const port = process.env.port || 8000;

const app = express();
app.set('host', process.env.HOST || '127.0.0.1');

app.use(cookieParser());
app.use(session({
  secret: 'mt tamalpais',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// middleware to ensure user is logged in by checking the req.session.userId

function requireLogin(req, res, next) {
  if (req.session.userId) { 
    return next();
  } else {
    res.redirect('/');
  }
}

app.all('/api/*', requireLogin);

app.get('/isAuth', ( req, res ) => {
	if (req.session.userId) {
		res.status(200).send({status: 'ACTIVE'})
	} else {
		res.status(200).send({status: 'INACTIVE'})
	}
});

/*
 * LOGIN POST ACTIONS
 */

	app.post('/login', (req, res) => {

		if(req.session.body) {
			res.status(200).json({status: 'AUTHENTICATED'});
		} else {
			handleLogin(req, res);
		}
	});

	app.post('/register', 		(req, res) => { postActions.register(req, res); });
	app.post('/mfa', 					(req, res) => { postActions.validateMFAs(req, res); });
	app.get('/passwordreset', (req, res) => { getActions.passwordReset(req, res); });

/*
 * API POST ACTIONS
 */
	app.post('/api/activateUser',		(req, res) => { postActions.activateUser(req, res); });
	app.post('/api/deleteUser', 		(req, res) => { postActions.deleteUser(req, res); });
	app.post('/api/unsuspendUser', 	(req, res) => { postActions.unsuspendUser(req, res); });
	app.post('/api/suspendUser', 		(req, res) => { postActions.suspendUser(req, res); });
	app.post('/api/newuser', 				(req, res) => { postActions.newUser(req, res); });
	app.post('/api/passwordExpire', (req, res) => { postActions.passwordExpire(req, res); });
	app.post('/api/deactivateUser', (req, res) => { postActions.deactivateUser(req, res); });
  app.post('/api/reactivateUser', (req, res) => { postActions.reactivateUser(req, res); });
  app.post('/api/unlockUser', 		(req, res) => { postActions.unlockUser(req, res); });

/*
 * API GET ACTIONS
 */
	app.get('/api/applinks', 				(req, res) => { getActions.getApps(req, res); });
	app.get('/api/groups', 					(req, res) => { getActions.getGroups(req, res); });
	app.get('/api/getUsers', 				(req, res) => { getActions.getUsers(req, res); });
	app.get('/api/getUser/:userId', (req, res) => { getActions.getUserById(req,res); });
	app.get('/api/getCurrentUser', 	(req, res) => {	getActions.getAUser(req, res)});

/*
 * API PUT ACTIONS
 */
	app.put('/api/updateuser', (req, res) => { postActions.updateUser(req, res); });

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.status(200).send({logout: 'logout'});
});

app.get('/*', (req, res) => { res.redirect('/'); });

app.listen(port, console.log(`Server running on port ${port}`));