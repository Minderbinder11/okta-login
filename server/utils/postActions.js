// postActions.js

import request from 'request';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;
const apiKey = config.API_KEY;

var options = { 
	method: 'POST',
	headers: { 
		'cache-control': 'no-cache',
   	'authorization': 'SSWS '+ apiKey,
   	'accept': 'application/json',
   	'content-type': 'application/json' 
   } 
 };

module.exports.enrollMFAs = (req, res, body) => { 

	req.session.userId = body._embedded.user.id;

	options.url = oktaUrl + '/api/v1/users/'+ body._embedded.user.id +'/factors',
	options.body = { 
		factorType: 'token:software:totp', 
	  	provider: 'GOOGLE' 
	  };
	options.json= true;

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


module.exports.newUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users';
	options.qs = { activate: 'true' },
	options.body = { 
		profile: { 
			firstName: 			req.body.firstName,
      lastName: 			req.body.lastName,
      email: 					req.body.email,
      login: 					req.body.username,
      streetAddress: 	req.body.address,
      city: 					req.body.city,
      state: 					req.body.state,
      zipCode: 				req.body.zip
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

module.exports.activateUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/activate';
  options.qs = { sendEmail: 'false' };

	request(options, function (error, response, body) {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  	res.json({status: 'SUCCESS'})
	  }
	});

};
 
module.exports.updateUser = (req, res) => {

	var userId = req.body.userId;
	var obj = req.body;
	delete obj.userId;


	options.url = oktaUrl + '/api/v1/users/' + userId;
	options.body = {profile: obj};
	options.json = true;

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


// check on the userID field,  shouldnt this come from req.body.userId?
module.exports.passwordReset = (req, res, userId) => {

  options.url = oktaUrl + '/api/v1/users/'+ userId +'/lifecycle/reset_password';
  options.qs = { sendEmail: 'true' };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
      res.json({error: error});
    } else {
      res.json({
        status: 'SUCCESS',
        link: body
      });
    }
  });

};


module.exports.passwordExpire = (req, res ) => {

  options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/expire_password';
  options.qs = { tempPassword: false };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
      res.json({error: error});
    } else {
      res.json({
        status: 'SUCCESS',
        link: body
      });
    }
  });

};




