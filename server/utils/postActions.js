// postActions.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

var options = { 
	method: 'POST',
	headers: { 
		'cache-control': 'no-cache',
   	'authorization': 'SSWS '+ apiKey,
   	'accept': 'application/json',
   	'content-type': 'application/json' 
   } 
 };

module.exports.newUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users';
	options.qs = { activate: 'true' },
	options.body = { 
		profile: { 
			firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      login: req.body.username,
      streetAddress: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zip
     },
    credentials: { 
     	password: { value: req.body.password } 
     	}	 
   	};
	options.json =  true ;

	request(options, function (error, response, body) {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error})
	  } else {
	  	res.json({status: 'SUCCESS'});
	  	console.log(body);
	  }
	});
};

module.exports.updateUser = (req, res) => {

	var userId = req.body.userId;
	var obj = req.body;
	delete obj.userId;


	var options = { 
		method: 'POST',
	  url: oktaUrl + '/api/v1/users/' + userId,
	  headers: 
	   { 'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' },
	  body: 
	   { profile: obj},
	  	json: true 
	  };

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error})
	  } else {
	  	res.json({status: 'SUCCESS'});
	  }
	});
	
};


module.exports.unsuspendUser = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/unsuspend';

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  res.json({status: 'SUCCESS'});
		}
	});
	
};


module.exports.suspendUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/suspend';

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  res.json({status: 'SUCCESS'});
		}
	});

};
