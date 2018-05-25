const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('../logger');
const fs = require('fs-extra');
const TestPlanService = require('../service/testplan-service');
const TaskState = require('../models/task').State;

const api = express.Router();

api.post('/', bodyParser.json(), (req, res) => {
  let testPlanId = req.serial;

  let doc = {
    testPlanId: testPlanId,
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
    creator: req.user.username,
    assignee: req.body.assignee,
    type: req.body.type,
    description: req.body.description,
    branch: req.body.branch,
    platform: req.body.platform,
    testcases: req.body.testcases,
    environment: req.body.environment,
    channel: req.body.channel,
    params: req.body.params,
    verdict: req.body.verdict,
    lastUpdatedAt: new Date(),
    lastUpdatedBy: req.user.username
  };

  if (req.body.appUrl !== '') {
    doc.appUrl = req.body.appUrl;
  }

  (async () => {
    doc.serial = await TestPlanService.getNextTaskSerial(testPlanId);
    doc.state = 'new';
    let task = await TestPlanService.createTask(doc, req.user.username);
    if (task) {
      await TestPlanService.addCollaborator(testPlanId, req.user.username);
      fs.ensureDir(`${config.core.attachmentDir}/${testPlanId}/${task.serial}`);
      res.status(200).json({
        success: true,
        task: task
      });
    } else {
      logger.error('error creating task');
      res.status(500).json({
        success: false,
        info: 'Error creating task'
      });
    }
  })();
});

api.put('/:serial', bodyParser.json(), (req, res) => {
  let serial = req.params.serial;
  let testPlanId = req.serial;
  (async () => {
    try {
      let oldTask = await TestPlanService.findTaskBySerial(serial, testPlanId);
      let taskObject = {
        serial: req.body.serial,
        testPlanId: testPlanId,
        name: req.body.name,
        start: new Date(req.body.start),
        end: new Date(req.body.end),
        assignee: req.body.assignee,
        type: req.body.type,
        description: req.body.description,
        branch: req.body.branch,
        platform: req.body.platform,
        testcases: req.body.testcases,
        environment: req.body.environment,
        channel: req.body.channel,
        params: req.body.params,
        verdict: req.body.verdict,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: req.user.username
      };
      if (oldTask.state === req.body.state && oldTask.state !== TaskState.NEW &&
        (oldTask.platform !== req.body.platform || !_.isEqual(oldTask.testcases, req.body.testcases))) {
        taskObject.state = TaskState.IN_PROGRESS;
      } else {
        taskObject.state = req.body.state;
      }

      if (req.body.appUrl && req.body.appUrl !== '') {
        taskObject.appUrl = req.body.appUrl;
      }

      let task = await TestPlanService.updateTaskBySerial(serial, testPlanId, taskObject);
      await TestPlanService.compareAndRecordActivity(task, oldTask, req.user.username, true);
      await TestPlanService.addCollaborator(testPlanId, req.user.username);
      res.status(200).json({
        success: true,
        task: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        info: error.message
      });
    }
  })();
});

api.put('/:serial/state', bodyParser.json(), async (req, res) => {
  let serial = req.params.serial;
  let testPlanId = req.serial;
  let newState = req.body.state;
  if (!TestPlanService.isTaskStateValid(newState)) {
    res.status(400).json({
      success: false,
      info: 'Invalid task state.'
    });
  } else {
    try {
      let task = await TestPlanService.updateTaskStateByOperation(serial, testPlanId, newState, req.user.username);
      await TestPlanService.addCollaborator(testPlanId, req.user.username);
      res.status(200).json({
        success: true,
        task: task
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        info: err.message
      });
    }
  }
});

api.get('/:serial', (req, res) => {
  let serial = req.params.serial;
  let testPlanId = req.serial;

  (async () => {
    try {
      let task = await TestPlanService.findTaskBySerial(serial, testPlanId);
      if (task) {
        res.status(200).json({
          success: true,
          task: task
        });
      }
    } catch (err) {
      logger.error(err);
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
  })();
});

api.get('/', (req, res) => {
  let testPlanId = req.serial;
  let skip = parseInt(req.query.skip) || 0;
  let limit = parseInt(req.query.limit) || 10;
  TestPlanService.listTasks(testPlanId, skip, limit).then(tasks => {
    res.status(200).json({success: true, info: 'OK', count: tasks.count, tasks: tasks.data}).end();
  }).catch(err => {
    if (err.name === 'MongoError' && err.code === 17144) {
      res.status(500).json({success: false, info: 'Failed to list tasks: Memory overflow has happened in MongoDB.' }).end();
    } else {
      res.status(500).json({success: false, info: 'Failed to list tasks. ' + err}).end();
    }
  });
});

module.exports = api;
