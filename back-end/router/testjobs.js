var express = require('express');
var bodyParser = require('body-parser');
var runner = require('../runner/runner');
var TestJobModel = require('../models/testjobs').Model;
var StepModel = require('../models/steps').Model;
const TestcaseService = require('../service').TestcaseService;
const TestJobService = require('../service/testjob-service');
var request = require('request');
var proxy = require('./steps/proxy');
var step = require('./steps/testcases');
var logger = require('../logger');
var logs = require('./testjobs-logs');
var steps = require('./testjobs-steps');
var execStack = require('./testjobs-exec-stack');
var elements = require('./steps/elements');
var SocketService = require('../service/socket-service');

var jsonParser = bodyParser.json();

var api = express.Router();

api.use('/:serial/testcases',
  function(req, res, next) {
    req.serial = req.params.serial;
    next();
  },
  step
);

api.use('/:serial/logs',
  function(req, res, next) {
    req.serial = req.params.serial;
    next();
  },
  logs
);

api.use('/:serial/steps',
  function(req, res, next) {
    req.serial = req.params.serial;
    next();
  },
  steps
);

api.use('/:serial/exec_stack',
  function(req, res, next) {
    req.serial = req.params.serial;
    next();
  },
  execStack
);

api.use('/:serial/hub',
  jsonParser,
  function(req, res, next) {
    var node = runner.getNode(req.params.serial);
    if(!node) {
      logger.error('Node is not allocated.');
      next();
      return;
    }
    request({
      url: node.driverUrl + req.path,
      method: req.method,
      body: JSON.stringify(req.body)
    }, function(hubErr, hubRes, hubBody) {
      if(hubErr) {
        logger.error('Failed to connect to Selenium grid. ' + hubErr);
      }
      if(!hubBody) {
        logger.error(`Selenium Grid responses without body. ${hubErr} Response: ${JSON.stringify(hubRes)}`);
      }
      try {
        req.hub = {};
        req.hub.serial = req.params.serial;
        req.hub.hubErr = hubErr;
        req.hub.hubRes = hubRes;
        req.hub.hubBody = JSON.parse(hubBody);
      } catch (err) {
        if(hubBody) {
          logger.error('Failed to parse grid response. Response : ' + hubBody);
          req.hub.hubBody = hubBody;
          if(!hubErr) req.hub.hubErr = true;
        }
      }
      next();
    });
  },
  proxy,
  function(req, res) {
    if(req.hub && !req.hub.hubErr) {
      res.status(req.hub.hubRes.statusCode).json(req.hub.hubBody).end();
    } else {
      res.status(500).end(req.hub && req.hub.hubBody ? req.hub.hubBody : '');
    }
  }
);

const api_jobs = {};
const rawParser = bodyParser.raw({
  type: '*/*'
});
const intoStream = require('into-stream');
api.use('/:serial/requests',
  rawParser,
  function(req, res, next) {
    (async () => {
      const serial = req.params.serial;
      if (!api_jobs[serial]) {
        try {
          api_jobs[serial] = await TestJobModel.retrieve(serial);
        } catch (err) {
          res.status(500).json({success: false, info: 'Failed to retrieve a test job. ' + err}).end();
        }
      }
      const api_job = api_jobs[serial];
      if (!api_job.requestStartTime) {
        elements.createSession(serial);
        api_job.requestStartTime = Date.now();
      }
      let url = api_job.params.url;
      if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
      }
      let path = req.path;

      const req_headers = req.headers;
      req_headers['host'] = url;

      const step = {
        timestamp: (Date.now() - api_job.requestStartTime) / 1000,
        action: req.method,
        inputValue: url + path,
        element: {}
      };
      const requestBody = req.body;
      const stepRequestObj = {};
      stepRequestObj.headers = JSON.stringify(req_headers);
      if (Object.getPrototypeOf(requestBody) === Object.prototype) {
        stepRequestObj.body = JSON.stringify(requestBody);
      } else {
        stepRequestObj.body = requestBody.toString();
      }
      if (req.method === 'GET') {
        stepRequestObj.body = '';
      }
      step.element.request = stepRequestObj;
      StepModel.appendStep(serial, step);
      SocketService.broadcastToTestJobUserOrGroups('step', serial, {forceToAllUsers: true}, step);

      const stream = intoStream(stepRequestObj.body);
      stream.method = req.method;
      stream.headers = req_headers;

      stream.pipe(
        request(
          {
            url: url + path,
            method: stream.method
          },
          function(error, response, responseBody) {
            if (error) {
              logger.error('Failed to connect to destination. ' + error);
            }

            const stepResponseObj = {};
            stepResponseObj.headers = JSON.stringify(response.headers);
            stepResponseObj.body = responseBody;
            stepResponseObj.statusCode = response.statusCode;
            stepResponseObj.statusMessage = response.statusMessage;
            step.element.response = stepResponseObj;

          })).pipe(res);
    })();
  }
);

api.post('/', jsonParser, function(req, res) {
  (async () => {
    let testcasesWithMethod = req.body.testcases.filter(tc => tc.indexOf('#') > 0);
    let testcasesFilled = [];
    if (req.body.testcases && testcasesWithMethod.length < req.body.testcases.length) {
      let listToFill = req.body.testcases.filter(tc => tc.indexOf('#') < 0);
      testcasesFilled = await TestcaseService.getTestcasesByLocatorPrefix(req.body.branch, listToFill);
    }
    testcasesFilled = testcasesWithMethod.concat(...testcasesFilled);
    let job = await runner.createTestJob({
      operator: req.user.username,
      name: req.body.name,
      branch: req.body.branch,
      url: req.body.url,
      appUrl: req.body.appUrl,
      channel: req.body.channel,
      channelId: req.body.channelId,
      username: req.body.username,
      password: req.body.password,
      platform: req.body.platform,
      groups: req.body.groups,
      testcases: testcasesFilled,
      params: req.body.params
    }, {
      testPlanSerial: req.body.testPlanSerial,
      taskSerial: req.body.taskSerial
    });
    res.status(201).json({success: true, info: 'A test job is triggered.', serial: job.serial}).end();
  })().catch(err => {
    res.status(500).json({
      success: false,
      info: `Internal error: ${err}`
    }).end();
  });

});

api.put('/:serial/resolve', jsonParser, function(req, res) {
  var serial = req.params.serial;
  TestJobService.updateResolve(serial, req.body).then(() => {
    res.status(200).json({success: true, info: 'Resolve updated.'}).end();
  }).catch(err => {
    res.status(400).json({success: false, info: 'Failed to update a resolve. ' + err}).end();
  });
});

api.delete('/:serial', function(req, res) {
  var serial = req.params.serial;
  runner.cancelTestJob(serial).then(() => {
    res.status(200).json({success: true, info: 'Test job canceled.'}).end();
  }).catch(err => {
    //if(!err) res.status(404).json({success: false, info: 'Test job not found.'}).end();
    res.status(400).json({success: false, info: 'Failed to cancel a test job. ' + err}).end();
  });
});

api.get('/', function(req, res) {
  var skip = parseInt(req.query.skip) || 0;
  var limit = parseInt(req.query.limit) || 100;
  var showAll = parseInt(req.query.showAll) || 0;
  var schedule = isNaN(parseInt(req.query.schedule)) ? undefined : parseInt(req.query.schedule);
  var testPlan = isNaN(parseInt(req.query.testPlan)) ? undefined : parseInt(req.query.testPlan);
  var task = isNaN(parseInt(req.query.task)) ? undefined : parseInt(req.query.task);
  var branch = req.query.branch;
  var locator = req.query.locator;
  TestJobModel.list(skip, limit, showAll, schedule, testPlan, task, branch, locator).then(jobs => {
    res.status(200).json({success: true, info: 'OK', count: jobs.count, testjobs: jobs.data}).end();
  }).catch(err => {
    if (err.name === 'MongoError' && err.code === 17144) {
      res.status(500).json({success: false, info: 'Failed to list test jobs: Memory overflow has happened in MongoDB.' }).end();
    } else {
      res.status(500).json({success: false, info: 'Failed to list test jobs. ' + err}).end();
    }
  });
});

api.get('/:serial', function(req, res) {
  var serial = parseInt(req.params.serial);
  var skip = parseInt(req.query.skip);
  var limit = parseInt(req.query.limit);
  skip = isNaN(skip) ? undefined : skip;
  limit = isNaN(limit) ? undefined : limit;
  if(isNaN(serial)) {
    res.status(400).json({success: false, info: 'Invalid serial.'}).end();
    return;
  }
  TestJobModel.retrieve(serial, skip, limit).then(data => {
    if(data && data.serial) res.status(200).json({success: true, info: 'OK', testjobs: data}).end();
    else res.status(404).json({success: false, info: `Test job #${serial} is not found.`}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Failed to retrieve a test job. ' + err}).end();
  });
});

module.exports = api;
