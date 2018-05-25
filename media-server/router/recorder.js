var express = require('express');
var bodyParser = require('body-parser');
var logger = require('../logger');
var recorder = require('../recorder');
var config = require('../config');

var api = express.Router();

var jsonParser = bodyParser.json();

// Start record
api.post('/:serial', jsonParser, function(req, res) {
  (async () => {
    var serial = req.params.serial;
    var opts = {fps:15, keyframe: 15};
    if(req.body.password) opts.password = req.body.password;
    await recorder.startRecord(serial, req.body.host, req.body.port, `${config.core.videoDir}${serial}.flv`, opts);
  })().then(() => {
    logger.info(`Start record VNC ${req.body.host}:${req.body.port}.`);
    res.status(200).json({success: true, info: 'Record started.'}).end()
  }).catch(err => {
    logger.debug(err.message);
    res.status(500).json({success: false, info: err.message}).end()
  });
});

// Stop record
api.put('/:serial', function(req, res) {
  (async () => {
    var serial = req.params.serial;
    await recorder.stopRecord(serial);
  })().then(() => {
    res.status(200).json({success: true}).end()
  }).catch(err => {
    logger.debug(err.message);
    res.status(500).json({success: false, info: err.message}).end()
  });
});

module.exports = api;
