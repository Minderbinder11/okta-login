import request 			from 'request';
import postActions 	from './postActions';
import config 			from '../config.json';

const oktaUrl = config.oktaUrl;
const apiKey = config.API_KEY;

var options = {
	method: 'GET',
	headers: 
   { 'cache-control': 'no-cache',
		 'authorization': 'SSWS '+ apiKey,
     'content-type': 'application/json',
     'accept': 'application/json' }

};

module.exports.getAUser = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/' + req.session.userId,

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	body = JSON.parse(body);
			res.status(200).json({
				status: 'SUCCESS',
				user: body, 
			})
		}
	});
};


module.exports.getUserById = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/' + req.params.userId,

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	body = JSON.parse(body);
			res.status(200).json({
				status: 'SUCCESS',
				user: body, 
			})
		}
	});
};

module.exports.getApps = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/appLinks'

	request(options, (error, response, body) => {
		if (error) {
	  	res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			res.status(200).json(body);
		}
	});
};

// gets all users
module.exports.getUsers = (req, res) => {

	options.url =  oktaUrl + '/api/v1/users';

	request(options, (error, response, body) => {
	  if (error) {
	  	res.status(500).send(error);
	  } else {
	  	body = JSON.parse(body);
      console.log('all users: ', body);
	  	res.status(200).json({users: body});
	  }
	});
};

module.exports.getMFAs = (req, res, userId) => {

  options.url = oktaUrl + '/api/v1/users/'+ req.session.tempId +'/factors';
 
  request(options, (error, response, body) => {
    if (error) {
	  	res.status(500).send(error);
	  	return;
    } 

    body = JSON.parse(body);
    
    if (body.length === 0) {
      res.status(200).json({error: true});
      return;
    } 
    
    var googleAuthenticator = body.filter(factor => {
    		return	(factor.factorType === "token:software:totp" && factor.provider === 'GOOGLE')});
    var factorId = googleAuthenticator[0].id;
    req.session.factorId = factorId;
    res.json({
      success: 'SUCCESS',
      mfas: googleAuthenticator, 
      error: false
    });
  });
};

// use this to find the admin users
module.exports.getGroups = (req, res) => {
	
	req.session.isAdmin = false;
	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/groups';

	request(options, (error, response, body) => {

	  if (error) {
	  	res.status(500).send(error);
	  } else {
		 	body = JSON.parse(body);
		  body.map(group => {
		  	
		  	if (group.profile.name === 'admin'){
		  		req.session.isAdmin = true;
		  		res.status(200).json({status: 'admin'});
		  	}
		  });

		  if (!req.session.isAdmin) {
		  	req.session.isAdmin = false;
		  	res.status(200).json({status: 'user'});
		  }
		}
	});
};

module.exports.passwordReset = (req, res) => {

 options.url = oktaUrl + '/api/v1/users';
 options.qs = { q: req.query.email };

	request(options, function (error, response, body) {
	  if (error) {
	  	res.status(500).send(error);
	  }
	  
	  body = JSON.parse(body);
		var userId = body[0].id;

		if (body[0].profile.email === req.query.email) {
			postActions.passwordReset(req, res, userId);
		} else {
			res.status(200).json({status: 'NO_USERID'})
		}	
	});
};


