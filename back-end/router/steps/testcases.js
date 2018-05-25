var logger = require('../../logger');
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var TestJobModel = require('../../models/testjobs').Model;
var StepModel = require('../../models/steps').Model;
var ExecStackModel = require('../../models/exec-stack').Model;
var elements = require('./elements');
var SocketService = require('../../service/socket-service');

var api = express.Router();

api.post('/:testcase', jsonParser, function(req, res) {
  (async () => {
    var step = {
      timestamp: elements.diffTime(req.serial),
      element: {using: 'plain', value: req.params.testcase},
      action: 'Testcase',
      inputValue: 'RUNNING'
    };
    logger.info(`Test case [${req.params.testcase}] of job #${req.serial} is marked as running.`);
    StepModel.appendStep(req.serial, step);
    SocketService.broadcastToTestJobUserOrGroups('step', req.serial, {forceToAllUsers: true}, step);
  })().then(() => res.status(200).end())
    .catch(err => res.status(500).json({success: false, err: err.message}).end());
});

api.put('/:testcase', jsonParser, function(req, res) {
  var key = {
    PASSED: 'result.passed',
    FAILED: 'result.failed',
    CANCELED: 'result.canceled'
  };
  (async () => {
    let serial = req.serial;
    let testcase = req.params.testcase;
    let status = req.body.status;
    if (status) {
      logger.info(`Update test case [${testcase}] of job #${serial} to ${status}`);
      var progress = {};
      progress[key[status]] = 1;
      await StepModel.updateStepResult(serial, testcase, status);
      await SocketService.broadcastToTestJobUserOrGroups('step_result', serial, {forceToAllUsers: true}, testcase, status);
      await TestJobModel.updateProgress(serial, progress);
      await SocketService.broadcastToTestJobUserOrGroups('progress', serial, {forceToAllUsers: true}, progress);
    } else {
      var exception = {
        timestamp: elements.diffTime(serial),
        class: req.body.class,
        method: req.body.method,
        line: req.body.line,
        classCall: req.body.classCall,
        lineCall: req.body.lineCall,
        message: req.body.message
      };
      let codesAndMethods = await ExecStackModel.recordException(serial, testcase, exception);
      await SocketService.broadcastToTestJobUserOrGroups(
        'exec_stack_exception', serial, {forceToAllUsers: true}, testcase.replace(/\./g, '/'), exception, codesAndMethods);
    }
  })().then(() => res.status(200).end())
    .catch(err => res.status(500).json({success: false, err: err.message}).end());
});

module.exports = api;
