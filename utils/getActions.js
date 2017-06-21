'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _postActions = require('./postActions');

var _postActions2 = _interopRequireDefault(_postActions);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oktaUrl = _config2.default.oktaUrl;
var apiKey = _config2.default.API_KEY;

var options = {
	method: 'GET',
	headers: { 'cache-control': 'no-cache',
		'authorization': 'SSWS ' + apiKey,
		'content-type': 'application/json',
		'accept': 'application/json' }

};

module.exports.getAUser = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.session.userId, (0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			res.status(200).json({
				status: 'SUCCESS',
				user: body
			});
		}
	});
};

module.exports.getUserById = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.params.userId, (0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			res.status(200).json({
				status: 'SUCCESS',
				user: body
			});
		}
	});
};

module.exports.getApps = function (req, res) {

	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/appLinks';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			res.status(200).json(body);
		}
	});
};

// gets all users
module.exports.getUsers = function (req, res) {

	options.url = oktaUrl + '/api/v1/users';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			console.log('all users: ', body);
			res.status(200).json({ users: body });
		}
	});
};

module.exports.getMFAs = function (req, res, userId) {

	options.url = oktaUrl + '/api/v1/users/' + req.session.tempId + '/factors';

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
			return;
		}

		body = JSON.parse(body);

		if (body.length === 0) {
			res.status(200).json({ error: true });
			return;
		}

		var googleAuthenticator = body.filter(function (factor) {
			return factor.factorType === "token:software:totp" && factor.provider === 'GOOGLE';
		});
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
module.exports.getGroups = function (req, res) {

	req.session.isAdmin = false;
	options.url = oktaUrl + '/api/v1/users/' + req.session.userId + '/groups';

	(0, _request2.default)(options, function (error, response, body) {

		if (error) {
			res.status(500).send(error);
		} else {
			body = JSON.parse(body);
			body.map(function (group) {

				if (group.profile.name === 'admin') {
					req.session.isAdmin = true;
					res.status(200).json({ status: 'admin' });
				}
			});

			if (!req.session.isAdmin) {
				req.session.isAdmin = false;
				res.status(200).json({ status: 'user' });
			}
		}
	});
};

module.exports.passwordReset = function (req, res) {

	options.url = oktaUrl + '/api/v1/users';
	options.qs = { q: req.query.email };

	(0, _request2.default)(options, function (error, response, body) {
		if (error) {
			res.status(500).send(error);
		}

		body = JSON.parse(body);
		var userId = body[0].id;

		if (body[0].profile.email === req.query.email) {
			_postActions2.default.passwordReset(req, res, userId);
		} else {
			res.status(200).json({ status: 'NO_USERID' });
		}
	});
};