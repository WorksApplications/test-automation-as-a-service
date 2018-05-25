var express = require('express');
var Testcases = require('../models/testcases').Model;

var api = express.Router();

api.get('/:branch?', function(req, res) {
  var branch = req.params.branch || 'develop';
  Testcases.retrieve(branch).then(data => {
    if(data) {
      const testcases = data.testcases;
      if (branch.startsWith('TaaS_')) {
        const branchArray = branch.split('_');
        var pointer = testcases;
        for(var ind = 1; ind < branchArray.length - 1; ind++) {
          Object.keys(pointer).forEach(key => {
            if (key !== branchArray[ind] && key !== 'taas_metadata') {
              delete(pointer[key]);
            }
          });
          pointer = pointer[branchArray[ind]];
        }
      }
      res.status(200).json({success: true, branch: data.branch, lastUpdate: data.date, testcases}).end();
    } else {
      res.status(404).json({success: false, testcases: {}}).end();
    }
  }).catch(err => {
    res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
  });
});

module.exports = api;
