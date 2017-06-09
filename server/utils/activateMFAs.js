// activateMFAs.js

import request from 'request';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;
const apiKey = config.API_KEY;

module.exports = (req, res) => { 

	var options = { 
		method: 'POST',
  	url: 'https://dev-477147.oktapreview.com/api/v1/users/'+ req.session.userId +'/factors/'+ req.session.factorId +'/lifecycle/activate',
  	headers: {
     	'cache-control': 'no-cache',
			'authorization': 'SSWS '+ apiKey,
     	'content-type': 'application/json',
     	'accept': 'application/json' },
  body: { passCode: req.body.mfacode },
  json: true };

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	res.status(200).json({status: 'SUCCESS'});
		}
	});
};