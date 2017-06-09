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

module.exports.validateMFAs = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/factors/' + req.session.factorId + '/verify';
	options.body =  { passCode: req.body.mfacode};
	options.json = true;

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  	return;
	  } 
	  res.status(200).json(body);
	});
};


module.exports.register = (req, res) => {

	var getoptions = {
		method: 'GET',
		headers: 
	   { 'cache-control': 'no-cache',
			 'authorization': 'SSWS '+ apiKey,
	     'content-type': 'application/json',
	     'accept': 'application/json' }
	};

	getoptions.url = oktaUrl + '/api/v1/users?q=' + req.body.email

	 request (getoptions, (error, response, body) => {

	 		var userFound = false;
		 	if (error) {
	  		res.status(500).send(error);
	  		return;
		 	}
		 	body = JSON.parse(body);

		 for (var i = 0; i < body.length; i++) {	
		 		
		 		if (body[i].profile !== undefined) {
		 			if (body[i].profile.email === req.body.email) {
						res.json({status: 'USER_EXISTS'});
						userFound = true; 
		 			} 
		 		}
		 }
		 	
		 if (! userFound)	{
			newUser(req, res);
		 }

	 });
};

module.exports.unlockUser = (req, res) => {
	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/unlock';

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  	return;
	  }
	  res.json({status: 'SUCCESS'})
	  
	});
};


module.exports.reactivateUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/reactivate?sendEmail=true';

	request(options, function (error, response, body) {		
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	res.json({status: 'SUCCESS'})
	  }
	});
};

module.exports.deactivateUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/deactivate';

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	res.json({status: 'SUCCESS'})
	  }
	});
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
	  	res.status(500).send(error); 	
	  } else {
		  req.session.factorId = body.id;
		  res.json({
		  	href: body._embedded.activation._links.qrcode.href,
		  	status: 'ENROLL'
		  });
		}
	});
};


function newUser (req, res) {

	options.url = oktaUrl + '/api/v1/users';
	options.qs = { activate: true },
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
     } 
   	};
	options.json =  true ;

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  } else {

	  		options.url = oktaUrl + '/api/v1/users/'+ body.id +'/lifecycle/activate';
  			options.qs = { sendEmail: true };
  			options.body = {};

				request(options, function (error, response, body) {
	  			if (error) {
	  				throw new Error(error);
	  				res.json({error: error});
	  			} else {
	  				res.json({status: 'SUCCESS'})
	  			}
				});
	  }
	});
};

module.exports.newUser = newUser;

module.exports.activateUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/activate';
  options.qs = { sendEmail: 'false' };

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
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
	  	res.status(500).send(error);
	  } else {
	  	res.json({status: 'SUCCESS'});
	  }
	});
};

module.exports.unsuspendUser = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/unsuspend';

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  res.json({status: 'SUCCESS'});
		}
	});
};

module.exports.suspendUser = (req, res) => {

	options.url = oktaUrl + '/api/v1/users/'+ req.body.userId +'/lifecycle/suspend';

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  res.json({status: 'SUCCESS'});
		}
	});

};


module.exports.passwordReset = (req, res, userId) => {  

  options.url = oktaUrl + '/api/v1/users/' + userId + '/lifecycle/reset_password';
  options.qs = { sendEmail: 'true' };

  request(options, (error, response, body) => {
    if (error) {
	  	res.status(500).send(error);
    } else {
      res.json({
        status: 'SUCCESS',
        link: body
      });
    }
  });
};


module.exports.passwordExpire = (req, res ) => {

  options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/expire_password';
  options.qs = { tempPassword: false };

  request(options, (error, response, body) => {
    if (error) {
	  	res.status(500).send(error);
    } else {
      res.json({
        status: 'SUCCESS',
        link: body
      });
    }
  });
};




