// enrollMFAs.js
import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

module.exports = (req, res, body) => { 

	req.session.userId = body._embedded.user.id;

	var options = { 
		method: 'POST',
	  url: oktaUrl + '/api/v1/users/'+ body._embedded.user.id +'/factors',
	  headers: 
	   { 'cache-control': 'no-cache',
	     'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' 
	   },
	  body: 
	  	{ factorType: 'token:software:totp', 
	  		provider: 'GOOGLE' 
	  	},
	  json: true
	};

	request(options, (error, response, body) => {
	  
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});  	
	  } else {
		  req.session.factorId = body.id;
		  res.json({
		  	href: body._embedded.activation._links.qrcode.href,
		  	status: 'ENROLL'
		  });
		}
	});
	
};