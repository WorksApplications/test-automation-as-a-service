var express = require('express');
var LogModel = require('../models/logs').Model;

var api = express.Router();

api.get('/', function(req, res) {
  var serial = req.serial;
  var skip = parseInt(req.query.skip);
  var limit = parseInt(req.query.limit);
  skip = isNaN(skip) ? undefined : skip;
  limit = isNaN(limit) ? undefined : limit;
  LogModel.retrieve(serial, skip, limit).then(data => {
    if(data && data.serial) res.status(200).json({success: true, info: 'OK', serial: serial, log: data.log}).end();
    else res.status(404).json({success: false, info: `Test job #${serial} is not found.`}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Failed to retrieve logs. ' + err}).end();
  });
});

module.exports = api;
