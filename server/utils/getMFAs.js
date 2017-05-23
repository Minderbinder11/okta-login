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
       'accept': 'application/json'
     } 
  };
   
  request(factorOptions, function (error, response, body) {
    if (error) {
      res.json({error: true});
    } else {
      body = JSON.parse(body);

      if (body.length === 0) {
        res.json({error: true});
      } else {
        // could make this more robus by searching for Google Auth in the array
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