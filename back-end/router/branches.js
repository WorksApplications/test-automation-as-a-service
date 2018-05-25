var express = require('express');
var runner = require('../runner/runner');
var config = require('../config');
var Branch = require('../models/branches').Model;

var api = express.Router();

api.get('/', function(req, res) {
  var repo = config.core.repo;
  Branch.retrieve(repo).then(data => {
    if(data) res.status(200).json({success: true, repo: data.repo, lastUpdate: data.date, branches: data.branches}).end();
    else res.status(404).json({success: false, branches: {}}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

api.put('/', function(req, res) {
  runner.listGitBranches().then(data => {
    res.status(201).json({success: true, info: 'A job for listing branches is triggered.', serial: data.serial}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Internal error. ' + err}).end();
  });
});

module.exports = api;
