var express = require('express');
var ExecStackModel = require('../models/exec-stack').Model;
var elements = require('./steps/elements');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var SocketService = require('../service/socket-service');

var api = express.Router();

api.get('/', function(req, res) {
  var serial = req.serial;
  var skip = parseInt(req.query.skip);
  var limit = parseInt(req.query.limit);
  skip = isNaN(skip) ? undefined : skip;
  limit = isNaN(limit) ? undefined : limit;
  ExecStackModel.retrieve(serial, skip, limit).then(data => {
    if(data && data.serial) res.status(200).json({success: true, info: 'OK', serial: serial, execStack: data}).end();
    else res.status(404).json({success: false, info: `Execution stack of test job #${serial} is not found.`, serial: serial, execStack: null}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Failed to retrieve execution stack. ' + err}).end();
  });
});

api.put('/', jsonParser, function(req, res) {
  (async() => {
    var serial = req.serial;
    var execStackEntry = {
      timestamp: elements.diffTime(serial),
      class: req.body.class,
      line: isNaN(parseInt(req.body.line)) ? null : parseInt(req.body.line),
      method: req.body.method,
      classCall: req.body.classCall,
      lineCall: isNaN(parseInt(req.body.lineCall)) ? null : parseInt(req.body.lineCall)
    };
    let codesAndMethods = await ExecStackModel.appendExecStack(serial, execStackEntry);
    await SocketService.broadcastToTestJobUserOrGroups('exec_stack', serial, {forceToAllUsers: true}, execStackEntry, codesAndMethods);
  })().then(() => res.status(200).end())
    .catch(err => res.status(500).json({success: false, err: err.message}).end());
});

module.exports = api;