// getAUser.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';


var options = {
	method: 'GET',
	headers: 
   { 'cache-control': 'no-cache',
		 'authorization': 'SSWS '+ apiKey,
     'content-type': 'application/json',
     'accept': 'application/json' }

};

module.exports.getAUser = (req, res) => { 

	options.url = oktaUrl + '/api/v1/users/' + req.params.userId,

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error})
	  } else {
			res.json({
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
			throw new Error(error);
			res.json({error: error});
		} else {
			body = JSON.parse(body);
			res.json(body);
		}
	});
};
// gets all users
module.exports.getUsers = (req, res) => {

	options.url =  oktaUrl + '/api/v1/users';

	request(options, (error, response, body) => {
	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
	  	body = JSON.parse(body);
	  	res.json({users: body});
	  }
	});

};

module.exports.getMFAs = (req, res) => {

  options.url = oktaUrl + '/api/v1/users/'+ req.session.userId +'/factors';
 
   
  request(options, (error, response, body) => {
    if (error) {
	  	throw new Error(error);    	
      res.json({error: true});
    } else {
      body = JSON.parse(body);
      if (body.length === 0) {
        res.json({error: true});
      } else {
        // could make this more robus by searching for Google Auth in the array
        // use a filter here
        var factorId = body[0].id;
        req.session.factorId = factorId;
        res.json({
          success: 'SUCCESS',
          mfas: body, 
          error: false
        });
      }
    }
  });
};



// use this to find the admin users
module.exports.getGroups = (req, res) => {
	
	req.session.isAdmin = false;
	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/groups';

	request(options, (error, response, body) => {

	  if (error) {
	  	throw new Error(error);
	  	res.json({error: error});
	  } else {
		 	body = JSON.parse(body);
		  body.map(group => {
		  	
		  	if (group.profile.name === 'admin'){
		  		req.session.isAdmin = true;
		  		res.json({status: 'admin'});
		  	}
		  });

		  if (!req.session.isAdmin) {
		  	req.session.isAdmin = false;
		  	res.json({status: 'user'});
		  }
		}
	});


};