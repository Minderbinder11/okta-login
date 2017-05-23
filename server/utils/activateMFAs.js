// activateMFAs.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

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
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  	res.json({status: 'SUCCESS'});
		}
	});
};