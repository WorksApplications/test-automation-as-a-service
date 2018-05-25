var express = require('express');
var bodyParser = require('body-parser');
var runner = require('../runner/runner');
var logger = require('../logger');
var GroupModel = require('../models/groups').Model;
var TestcaseModel = require('../models/testcases').Model;

var api = express.Router();

var jsonParser = bodyParser.json();

api.post('/merge_request', jsonParser, function(req, res) {
  var body = req.body;
  var branch = 'develop';
  var state = '';

  if (body.object_attributes !== null) {
    if (body.object_attributes.target_branch !== null) {
      branch = body.object_attributes.target_branch;
    }
    state = body.object_attributes.state;
  }
  let user = req.user;
  logger.info(`Received Webhook from user ${user.username} [Merge Request] on branch ${branch}. request body: ${JSON.stringify(req.body)}`);

  if (state === 'merged') {
    runner.createScanJob(branch);
  }
  res.status(200).end();
});

function isAllZero(str) {
  if(!str || typeof(str) !== 'string' || str.length !== 40) {
    return false;
  }
  if(str.replace(/0/g, '').length === 0) {
    return true;
  } else {
    return false;
  }
}

api.post('/push-events', jsonParser, function(req, res) {
  (async function () {
    var branch;
    if(req.body && req.body.ref) {
      runner.listGitBranches();
      branch = req.body.ref.split('/').slice(-1)[0];
      if(isAllZero(req.body.before) && !isAllZero(req.body.after)) {
        logger.info(`Branch ${branch} is created.`);
        await runner.createScanJob(branch);
      } else if (!isAllZero(req.body.before) && isAllZero(req.body.after)) {
        logger.info(`Branch ${branch} is deleted.`);
        await GroupModel.delete(branch);
        await TestcaseModel.delete(branch);
      } else if (!isAllZero(req.body.before) && !isAllZero(req.body.after) && req.body.before !== req.body.after) {
        logger.info(`Branch ${branch} is updated`);
        await runner.createScanJob(branch);
      }
    }
  })().then(() => res.status(200).end())
    .catch(() => res.status(500).end());
    
});

module.exports = api;
