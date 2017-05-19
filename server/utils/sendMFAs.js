// sendMFAs.js

import request from 'request';

const oktaUrl = 'https://dev-477147.oktapreview.com';
const apiKey = '00p_Z5emQrIXfw228qBmju0GtmVdDb3V_Vp0gwkpNb';

module.exports = (req, res) => {

  var factorOptions = { 
    method: 'GET',
    url: oktaUrl + '/api/v1/users/'+ req.session.userId +'/factors',
    headers: 
     { 'cache-control': 'no-cache',
       'authorization': 'SSWS '+ apiKey,
       'content-type': 'application/json',
       'accept': 'application/json' } 
  };

  // second request to get MFAs    
  request(factorOptions, function (error, response, body) {
    
    if (error) {
      res.json({error: true});
    } else {
      body = JSON.parse(body);

      if (body.length === 0) {
        // no MFA, send success
        res.json({
          success: 'SUCCESS',
          error: false,
          mfas: []
        });

      } else {
        console.log('3. Received list of factors');

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
}