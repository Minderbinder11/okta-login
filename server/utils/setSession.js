// setSession.js
import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';

module.exports = (req, res, sessionToken ) => {

  ///req.session.views = 1;

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
        // need to investiate if this is needed,  or if express sessions does this on its own.
         req.session.sessionId = body.id;
         console.log('set session: ', req.session.sessionId);
         
    } else {
      console.log('error: ', error);
    }
  }

  request(options, callback);
}