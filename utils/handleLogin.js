'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _getActions = require('./getActions');

var _getActions2 = _interopRequireDefault(_getActions);

var _postActions = require('./postActions');

var _postActions2 = _interopRequireDefault(_postActions);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//handleLogin.js
var oktaUrl = _config2.default.oktaUrl;

module.exports = function (req, res) {

	var options = {
		method: 'POST',
		url: oktaUrl + '/api/v1/authn',
		headers: { 'cache-control': 'no-cache',
			'content-type': 'application/json',
			'accept': 'application/json' },
		body: { username: req.body.username,
			password: req.body.password,
			options: { multiOptionalFactorEnroll: true,
				warnBeforePasswordExpired: true } },
		json: true
	};

	(0, _request2.default)(options, function (error, response, body) {

		if (error) {
			res.status(500).send(error);
			return;
		}

		if (body.status === 'SUCCESS') {
			req.session.tempId = body._embedded.user.id;
			_getActions2.default.getMFAs(req, res, req.session.tempId);
		} else if (body.status === 'MFA_ENROLL') {
			_postActions2.default.enrollMFAs(req, res, body);
		} else {
			res.status(200).json({ status: 'ERROR' });
		}
	});
};