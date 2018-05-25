var express = require('express');
var Testcode = require('../models/testcode').Model;

var api = express.Router();

api.get('/:branch?', function (req, res) {
  const branch = req.params.branch || 'develop';
  const className = req.query.class || undefined;
  Testcode.retrieve(branch, className).then(data => {
    if (data.codes) res.status(200).json({
      success: true,
      branch: data.branch,
      lastUpdate: data.date,
      codes: data.codes
    }).end();
    else res.status(404).json({success: false, codes: {}}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

module.exports = api;
