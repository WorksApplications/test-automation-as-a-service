var express = require('express');
var TestResultsModel = require('../models/testresults').Model;
var api = express.Router();

api.get('/', async function(req, res) {
  let branch = req.query.branch || 'develop';
  let locator = req.query.locator;
  let platform = req.query.platform;
  let limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
  let jobId = req.query.jobId ? Number.parseInt(req.query.jobId) : undefined;
  if (locator && branch && !platform && !jobId) {
    try {
      const testResults = await TestResultsModel.find({
        branch,
        locator
      }, {
        _id: false,
        report: false,
        locator: false,
        jobId: false,
        branch: false,
        failure: false,
        __v: false
      });
      res.status(200).json({
        success: true,
        testResults
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        info: 'Error occurred!'
      });
    }
  } else if (!locator || !platform) {
    if (jobId) {
      TestResultsModel.fetchByJobId(jobId).then(result => {
        res.status(200).json({
          success: true,
          testresults: result
        }).end();
      }).catch(err => {
        res.status(500).json({success: false, info: 'Retrived failed. ' + err}).end();
      });
    } else {
      res.status(400).json({
        success: false,
        info: 'locator and platform parameter can not be empty'
      });
    }
  } else if (jobId) {
    TestResultsModel.fetchByBranchLocatorAndJobId(branch, locator, platform, jobId).then(result => {
      res.status(200).json({
        success: true,
        testresults: result
      }).end();
    }).catch(err => {
      res.status(500).json({success: false, info: 'Retrived failed. ' + err}).end();
    });
  } else {
    TestResultsModel.fetchByBranchAndLocator(branch, locator, platform, limit).then(result => {
      res.status(200).json({
        success: true,
        testresults: result
      }).end();
    }).catch(err => {
      res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
    });
  }
});

module.exports = api;
