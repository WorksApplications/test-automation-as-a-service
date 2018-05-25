var request = require('request-promise');
var config = require('../config');

module.exports.startRecord = async function(serial, host, port, password) {
  var body = {
    host: host,
    port: port
  };
  if(password) body.password = password;
  var options = {
    method: 'POST',
    uri: `${config.mediaServer.recorderApi}/${serial}`,
    body: body,
    json: true,
    timeout: 2000
  };
  var res = await request(options);
  if(!res.success) throw new Error(res.info);
};

module.exports.stopRecord = async function(serial) {
  var options = {
    method: 'PUT',
    uri: `${config.mediaServer.recorderApi}/${serial}`,
    json: true,
    timeout: 2000
  };
  var res = await request(options);
  if(!res.success) throw new Error(res.info);
};
