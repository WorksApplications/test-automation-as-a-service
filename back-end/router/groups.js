var express = require('express');
var Group = require('../models/groups').Model;
var runner = require('../runner/runner');

var api = express.Router();

api.get('/', function(req, res) {
  Group.retrieve('develop').then(data => {
    if(data) res.status(200).json({success: true, branch: data.branch, lastUpdate: data.date, groups: data.groups}).end();
    else res.status(404).json({success: false, groups: {}}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

api.get('/:branch', function(req, res) {
  var branch = req.params.branch;
  Group.retrieve(branch).then(data => {
    if(data) res.status(200).json({success: true, branch: data.branch, lastUpdate: data.date, groups: data.groups}).end();
    else res.status(404).json({success: false, groups: {}}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

api.put('/:branch', function(req, res) {
  var branch = req.params.branch;
  runner.createScanJob(branch).then(data => {
    res.status(200).json({success: true, info: 'Scan job created.', serial: data.serial});
  });
});

module.exports = api;
