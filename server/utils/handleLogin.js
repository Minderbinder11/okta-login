//handleLogin.js
import request 			from 'request';
import getActions 	from './getActions';
import postActions	from './postActions';
import config 			from '../config.json';

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

		if(error) {
	  	res.status(500).send(error);
	  	return;
		} 
		 
		if (body.status === 'SUCCESS') {
	  	req.session.tempId = body._embedded.user.id;
			getActions.getMFAs(req, res, req.session.tempId);
		} 
		else if (body.status === 'MFA_ENROLL'){
			postActions.enrollMFAs(req, res, body);
		} else {
	  	res.status(200).json({status: 'ERROR'});
		}
	});

};