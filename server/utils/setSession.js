// setSession.js
import request from 'request';
import config from '../../config.json';

const oktaUrl = config.oktaUrl;

module.exports = (req, res, sessionToken ) => {

  var options = {
    url: oktaUrl + '/api/v1/sessions',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: '{"sessionToken": "' + sessionToken + '"}'
  };

  function callback(error, response, body) {

    console.log('in sessions callback');
    if (!error) {
        body = JSON.parse(body);
         req.session.sessionId = body.id;
         console.log('set session: ', req.session.sessionId);
         
    } else {
      console.log('error: ', error);
    }
  }

  request(options, callback);
}