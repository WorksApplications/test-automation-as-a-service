const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('../logger');
const fs = require('fs-extra');
const TestPlanService = require('../service/testplan-service');
const task = require('./testplan-task');

const api = express.Router();

api.use('/:serial/tasks',
  function(req, res, next) {
    req.serial = req.params.serial;
    next();
  },
  task
);

api.post('/', bodyParser.json(), async (req, res) => {

  let doc = {
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
    creator: req.user.username,
    collaborators: [],
    objective: req.body.objective,
    branch: req.body.branch,
    platforms: req.body.platforms,
    testcases: req.body.testcases,
    environment: req.body.environment,
    channel: req.body.channel,
    description: req.body.description,
    verdict: req.body.verdict,
    lastUpdatedAt: new Date(),
    lastUpdatedBy: req.user.username,
    taskCounter: 0
  };

  let testPlan = await TestPlanService.createTestPlan(doc);
  if (testPlan) {
    fs.ensureDir(`${config.core.attachmentDir}/${testPlan.serial}`);
    res.status(200).json({
      success: true,
      test_plan: testPlan
    });
  } else {
    logger.error('error creating test plan');
    res.status(500).json({
      success: false,
      info: 'Error creating test plan'
    });
  }
});

api.put('/:serial', bodyParser.json(), async (req, res) => {
  let serial = req.params.serial;
  let confirmApply = req.query.confirmApply;
  if (confirmApply) {
    confirmApply = new Boolean(confirmApply);
  }
  try {
    let testPlanObject = {
      serial: req.body.serial,
      name: req.body.name,
      state: req.body.state,
      start: new Date(req.body.start),
      end: new Date(req.body.end),
      objective: req.body.objective,
      branch: req.body.branch,
      platforms: req.body.platforms,
      testcases: req.body.testcases,
      environment: req.body.environment,
      channel: req.body.channel,
      description: req.body.description,
      verdict: req.body.verdict,
      lastUpdatedAt: new Date(req.body.lastUpdatedAt),
      lastUpdatedBy: req.body.lastUpdatedBy,
      taskCounter: req.body.taskCounter
    };
    if (!confirmApply) {
      let testPlanObsoleted = await TestPlanService.isTestPlanObsoleted(testPlanObject);
      if (testPlanObsoleted.obsoleted) {
        res.status(409).json({
          success: false,
          info: testPlanObsoleted.testPlanInDB,
          diff: testPlanObsoleted.diff
        });
        return;
      }
    }

    testPlanObject.lastUpdatedAt = new Date();
    testPlanObject.lastUpdatedBy = req.user.username;

    let oldTestPlan = await TestPlanService.getTestPlanBySerial(serial);
    let testPlan = await TestPlanService.updateTestPlanBySerial(serial, testPlanObject);
    testPlan = await TestPlanService.compareAndRecordActivity(testPlan, oldTestPlan, req.user.username);
    if (!_.isEqual(oldTestPlan.environment, testPlanObject.environment) && testPlanObject.environment.inherit) {
      await TestPlanService.updateTasksEnvironment(serial, testPlanObject.environment);
    }
    if (!_.isEqual(oldTestPlan.channel, testPlanObject.channel) && testPlanObject.channel.inherit) {
      await TestPlanService.updateTasksChannel(serial, testPlanObject.channel);
    }
    testPlan = await TestPlanService.addCollaborator(serial, req.user.username);
    res.status(200).json({
      success: true,
      test_plan: testPlan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      info: error.message
    });
  }
});

api.put('/:serial/attachment', bodyParser.json(), async (req, res) => {
  let testPlanSerial = req.params.serial;
  let taskSerial = parseInt(req.body.taskSerial) || undefined;
  let taskName = req.body.taskName;
  let attachments = req.body.attachments;
  let isUpload = req.body.isUpload;
  try {
    let testPlan = await TestPlanService.recordAttachmentActivity(testPlanSerial, taskSerial, taskName, attachments, isUpload, req.user.username);
    testPlan = await TestPlanService.addCollaborator(testPlanSerial, req.user.username);
    if (testPlan) {
      res.status(200).json({
        success: true,
        test_plan: testPlan
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      info: error.message
    });
  }
});

api.post('/:serial/comments', bodyParser.json(), async (req, res) => {
  let serial = req.params.serial;
  try {
    let testPlan = await TestPlanService.createComment(serial, req.user.username, req.body.content);
    testPlan = await TestPlanService.addCollaborator(serial, req.user.username);
    if (testPlan) {
      res.status(200).json({
        success: true,
        test_plan: testPlan
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      info: error.message
    });
  }
});

api.put('/:serial/comments/:id', bodyParser.json(), async (req, res) => {
  let serial = req.params.serial;
  let _id = req.params.id;
  try {
    let testPlan = await TestPlanService.updateComment(serial, _id, req.user.username, req.body.content);
    testPlan = await TestPlanService.addCollaborator(serial, req.user.username);
    if (testPlan) {
      res.status(200).json({
        success: true,
        test_plan: testPlan
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      info: error.message
    });
  }
});

api.get('/:serial/tasks_name', async (req, res) => {
  let serial = req.params.serial;
  try {
    let tasksName = await TestPlanService.getAllTasksName(serial);
    if (tasksName) {
      res.status(200).json({
        success: true,
        tasksName: tasksName
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      info: error.message
    });
  }
});

api.get('/:serial', async (req, res) => {
  let serial = req.params.serial;
  try {
    let testPlan = await TestPlanService.getTestPlanBySerial(serial);
    if (testPlan) {
      res.status(200).json({
        success: true,
        test_plan: testPlan
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json({
      success: false,
      error: 'Test Plan not found'
    });
  }
});

api.get('/', async (req, res) => {
  let skip = parseInt(req.query.skip) || 0;
  let limit = parseInt(req.query.limit) || 10;
  try {
    let testPlans = await TestPlanService.getTestPlanPaginated(skip, limit);
    res.status(200).json({
      success: true,
      test_plans: testPlans
    });
  } catch (err) {
    logger.error('Error fetching test plans paginated');
    res.status(500).json({
      success: false,
      error: err
    });
  }
});

module.exports = api;
