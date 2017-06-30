'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// postActions.js

var oktaUrl = _config2.default.oktaUrl;
var apiKey = _config2.default.API_KEY;

var options = {
	method: 'POST',
	headers: {
		'cache-control': 'no-cache',
		'authorization': 'SSWS ' + apiKey,
		'accept': 'application/json',
		'content-type': 'application/json'
	}
};

module.exports.activateMFAs = function (req, res) {

	options.url = 'https://dev-477147.oktapreview.com/api/v1/users/' + req.session.userId + '/factors/' + req.session.factorId + '/lifecycle/activate';
	options.body = { passCode: req.body.mfacode };
	options.json = true;

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.deleteUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/deactivate';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.validateMFAs = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.session.tempId + '/factors/' + req.session.factorId + '/verify';
	options.body = { passCode: req.body.mfacode };
	options.json = true;

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}

		if (body.factorResult === 'SUCCESS') {
			req.session.userId = req.session.tempId;
			res.status(200).json(body);
		} else {
			res.status(200).json({ error: 'ERROR' });
		}
	});
};

module.exports.register = function (req, res) {

	var getoptions = {
		method: 'GET',
		headers: { 'cache-control': 'no-cache',
			'authorization': 'SSWS ' + apiKey,
			'content-type': 'application/json',
			'accept': 'application/json' }
	};

	getoptions.url = oktaUrl + '/api/v1/users?q=' + req.body.email;

	(0, _request2.default)(getoptions, function (error, response, body) {

		var userFound = false;
		if (error) {
			res.status(500).send(error);
			return;
		}
		body = JSON.parse(body);

		for (var i = 0; i < body.length; i++) {

			if (body[i].profile !== undefined) {
				if (body[i].profile.email === req.body.email) {
					res.status(200).json({ status: 'USER_EXISTS' });
					userFound = true;
				}
			}
		}
		if (!userFound) {
			newUser(req, res);
		}
	});
};

module.exports.unlockUser = function (req, res) {
	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/unlock';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.reactivateUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/reactivate?sendEmail=true';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.deactivateUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/deactivate';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.enrollMFAs = function (req, res, body) {

	req.session.userId = body._embedded.user.id;

	options.url = oktaUrl + '/api/v1/users/' + body._embedded.user.id + '/factors', options.body = {
		factorType: 'token:software:totp',
		provider: 'GOOGLE'
	};
	options.json = true;

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		req.session.factorId = body.id;
		res.status(200).json({
			href: body._embedded.activation._links.qrcode.href,
			status: 'ENROLL'
		});
	});
};

function newUser(req, res) {

	options.url = oktaUrl + '/api/v1/users';
	options.qs = { activate: true }, options.body = {
		profile: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			login: req.body.username,
			streetAddress: req.body.address,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zip
		}
	};
	options.json = true;

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}

		options.url = oktaUrl + '/api/v1/users/' + body.id + '/lifecycle/activate';
		options.qs = { sendEmail: true };
		options.body = {};

		(0, _request2.default)(options, function (error, response, body) {
			if (error) {
				res.status(500).send(error);
				return;
			}
			res.status(200).json({ status: 'SUCCESS' });
		});
	});
};

module.exports.newUser = newUser;

module.exports.activateUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/activate';
	options.qs = { sendEmail: 'false' };

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.updateUser = function (req, res) {

	var userId = req.body.userId;
	var obj = req.body;
	delete obj.userId;

	options.url = oktaUrl + '/api/v1/users/' + userId;
	options.body = { profile: obj };
	options.json = true;

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.unsuspendUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/unsuspend';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.suspendUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/suspend';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({ status: 'SUCCESS' });
	});
};

module.exports.passwordReset = function (req, res, userId) {

	options.url = oktaUrl + '/api/v1/users/' + userId + '/lifecycle/reset_password';
	options.qs = { sendEmail: 'true' };

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({
			status: 'SUCCESS',
			link: body
		});
	});
};

module.exports.passwordExpire = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.body.userId + '/lifecycle/expire_password';
	options.qs = { tempPassword: false };

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}
		res.status(200).json({
			status: 'SUCCESS',
			link: body
		});
	});
};