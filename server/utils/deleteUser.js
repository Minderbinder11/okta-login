
// deleteUser.js

import request from 'request';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;
const apiKey = config.API_KEY;

module.exports = (req, res) => { 

	var options = { 
		method: 'POST',
  	url: oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/deactivate',
	  headers: 
	   {'cache-control': 'no-cache',
		   'authorization': 'SSWS '+ apiKey,
	     'accept': 'application/json',
	     'content-type': 'application/json' } };

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else{
	  	res.json({status: 'SUCCESS'});
	  }
	});

};