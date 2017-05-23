// getApps.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

module.exports = (req, res) => { 

	var options = { 
		method: 'GET',
   	url: oktaUrl + '/api/v1/users/' + req.session.userId + '/appLinks',
    headers: 
     {
	    'authorization': 'SSWS '+ apiKey,
      'content-type': 'application/json',
      'accept': 'application/json' }
		};

		request(options, (error, response, body) => {
			if (error) {
				res.json({error: error});
			} else {
				body = JSON.parse(body);
				res.json(body);
			}
		});

};