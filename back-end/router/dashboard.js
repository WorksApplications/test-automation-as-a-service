var express = require('express');
var DashboardModel = require('../models/dashboard').Model;
var api = express.Router();

api.get('/:branch?', function(req, res) {
  var branch = req.params.branch || 'develop';
  DashboardModel.retrieve(branch).then((result) => {
    res.status(200).json({
      success: true,
      dashboard: result
    }).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

module.exports = api;
