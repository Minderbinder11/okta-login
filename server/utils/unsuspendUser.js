// unsuspendUser.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

module.exports = (req, res) => { 

		var options = { method: 'POST',
	  url: oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/suspend',
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
	
};