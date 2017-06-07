//handleLogin.js

import request 			from 'request';
import getActions 	from './getActions';
import postActions	from './postActions';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;


module.exports = ( req, res ) => { 

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

	request(options, (error, response, body) => {

		console.log('in handle login: ', body)

		if(error) {
			console.log(error)
			//throw new Error(error);
			res.json({error: error});
		} else if (body.status === 'SUCCESS') {
	  	req.session.userId = body._embedded.user.id;
	  	req.session.sessionToken = body.sessionToken;
			getActions.getMFAs(req, res);
		} else if (body.status === 'MFA_ENROLL'){
			postActions.enrollMFAs(req, res, body);
		} else {
		  res.json({error: true});
		}
	});

};