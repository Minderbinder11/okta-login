// validateMFAs.js

import request from 'request';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;
const apiKey = config.API_KEY;

module.exports = (req, res) => { 

	var options = { 
		method: 'POST',
  	url: oktaUrl + '/api/v1/users/' + req.session.userId + '/factors/' + req.session.factorId + '/verify',
  	headers: { 
     	'cache-control': 'no-cache',
			'authorization': 'SSWS '+ apiKey,
     	'content-type': 'application/json',
     	'accept': 'application/json' },
	  body: { passCode: req.body.mfacode},
	  json: true };

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  	return;
	  } 
	  res.status(200).json(body);
	});
};