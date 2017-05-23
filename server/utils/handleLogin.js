//handleLogin.js

import request 			from 'request';
import getMFAs 			from './getMFAs';
import enrollMFAs		from './enrollMFAs';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

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
			throw new Error(error);
			res.json({error: error});

		} else if (body.status === 'SUCCESS') {

	  	req.session.userId = body._embedded.user.id;
	  	req.session.sessionToken = body.sessionToken;
			getMFAs(req, res);

		} else if (body.status === 'MFA_ENROLL'){
			enrollMFAs(req, res, body);
		} else {
		  res.json({error: true});
		}
	});

};