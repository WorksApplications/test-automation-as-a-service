const logger = require('../logger');
const diffJson = require('diff-json');
const _ = require('lodash');
const TestPlanModel = require('../models/testplan').Model;
const ActivityType = require('../models/testplan').ActivityType;
const TaskModel = require('../models/task').Model;
const TaskState = require('../models/task').State;

const service = {
  isTestPlanObsoleted: async (testPlan) => {
    let serial = testPlan.serial;

    let testPlanInDB = await TestPlanModel.findTestPlanBySerial(serial);

    if (testPlanInDB) {
      let lastUpdatedAt = new Date(testPlan.lastUpdatedAt);
  
      if (testPlanInDB.lastUpdatedAt && testPlanInDB.lastUpdatedAt.getTime() !== lastUpdatedAt.getTime()) {
        return {
          obsoleted: true,
          testPlanInDB,
          diff: service.getDiff(testPlan, testPlanInDB)
        };
      }
    }

    return {
      obsoleted: false
    };
  },
  getDiff: (testPlanV1, testPlanV2) => {
    let diff;
    try {
      diff = diffJson.diff(testPlanV1, testPlanV2);
    } catch (e) {
      logger.error(`Failed to get Diff ${e}`);
    }
    return diff;
  },
  createTestPlan: async (testPlan) => {
    let created = await TestPlanModel.createTestPlan(testPlan);
    if (created) {
      logger.info(`created test plan with serial ${created.serial}`);
    }
    return created;
  },
  updateTestPlanBySerial: async (serial, newTestPlan) => {
    try {
      let testPlan = await TestPlanModel.findOneAndUpdate({serial: serial}, newTestPlan, {new: true}).lean();
      return testPlan;
    } catch (err) {
      logger.error(`failed to update test plan ${serial}, ${err}`);
      throw err;
    }
  },
  setVerdictBySerial: async (serial, verdict) => {
    let testPlan = await TestPlanModel.findOneAndUpdate({serial: serial}, verdict, {new: true});
    return testPlan;
  },
  getTestPlanBySerial: async (serial) => {
    let testPlan = await TestPlanModel.findOne({serial: serial}).lean();
    if (testPlan) {
      return testPlan;
    } else {
      throw new Error('Test Plan not found');
    }
  },
  getTestPlanPaginated: async (skip = 0, limit = 10) => {
    let testPlans = await TestPlanModel.find({})
      .sort({ serial: -1 })
      .skip(skip).limit(limit);
    if (testPlans) {
      return testPlans;
    } else {
      throw new Error('Failed to find test plans');
    }
  },
  getNextTaskSerial: async (serial) => {
    let nextTaskSerial = await TestPlanModel.getNextTaskSerial(serial);
    if (nextTaskSerial) {
      return nextTaskSerial;
    } else {
      throw new Error('Failed to get next task serial');
    }
  },
  createTask: async (task, user) => {
    let created = await TaskModel.createTask(task);
    if (created) {
      await TestPlanModel.recordActivity(task.testPlanId, {
        user: user,
        type: ActivityType.OPERATE,
        date: new Date(),
        operation: `Create Task#${task.serial}: ${task.name}`
      });
      logger.info(`created task with serial ${created.serial}`);
    }
    return created;
  },
  updateTaskBySerial: async (serial, testPlanId, newTask) => {
    try {
      let task = await TaskModel.findOneAndUpdate({serial: serial, testPlanId: testPlanId}, newTask, {new: true}).lean();
      return task;
    } catch (err) {
      logger.error(`failed to update task ${serial}, ${err}`);
      throw err;
    }
  },
  findTaskBySerial: async (serial, testPlanId) => {
    let task = await TaskModel.findOne({serial: serial, testPlanId: testPlanId}).lean();
    if (task) {
      return task;
    } else {
      throw new Error('Task not found');
    }
  },
  listTasks: (testPlanId, skip, limit) => {
    return TaskModel.listTasks(testPlanId, skip, limit);
  },
  getAllTasksName: async (testPlanId) => {
    return TaskModel.find({testPlanId: testPlanId}).select({serial: true, name: true});
  },
  addCollaborator: async (testPlanId, collaborator) => {
    let oldTestPlan = await TestPlanModel.findOne({serial: testPlanId}).lean();
    let collaborators = oldTestPlan.collaborators || [];
    if (collaborator !== oldTestPlan.creator && !collaborators.includes(collaborator)) {
      collaborators.push(collaborator);
    }
    return TestPlanModel.findOneAndUpdate({serial: testPlanId}, {$set: {collaborators: collaborators}}, {new: true});
  },
  updateTasksEnvironment: async (testPlanId, environment) => {
    try {
      let tasks = await TaskModel.find({testPlanId: testPlanId});
      tasks.forEach(async task => {
        await TaskModel.findOneAndUpdate({serial: task.serial, testPlanId: testPlanId}, {$set: {environment: environment}}, {new: true});
      });
    } catch (err) {
      logger.error(`Failed to update tasks environment caused by test plan ${testPlanId}, ${err}`);
      throw err;
    }
  },
  updateTasksChannel: async (testPlanId, channel) => {
    try {
      let tasks = await TaskModel.find({testPlanId: testPlanId});
      tasks.forEach(async task => {
        await TaskModel.findOneAndUpdate({serial: task.serial, testPlanId: testPlanId}, {$set: {channel: channel}}, {new: true});
      });
    } catch (err) {
      logger.error(`Failed to update tasks channel caused by test plan ${testPlanId}, ${err}`);
      throw err;
    }
  },
  compareAndRecordActivity: async (newObject, oldObject, user, isTask = false) => {
    try {
      let diff = [];
      let keysExcluded = ['_id', 'activities', 'lastUpdatedBy', 'lastUpdatedAt', '__v'];
      let diffRecursive = (object1, object2, keyPrefix) => {
        Object.keys(object1).forEach(key => {
          let newValue = object1[key];
          let oldValue = object2[key];
          if (!keysExcluded.includes(key) && !_.isEqual(newValue, oldValue)) {
            if (key === 'start' || key === 'end') {
              diff.push({
                key: keyPrefix + key + '.date',
                newValue: newValue.toDateString(),
                oldValue: oldValue.toDateString()
              });
            } else if (typeof newValue === 'object' && !Array.isArray(newValue)) {
              diffRecursive(newValue, oldValue, keyPrefix + key + '.');
            } else if (keyPrefix + key !== 'channel.id') {
              diff.push({
                key: keyPrefix + key,
                newValue: newValue,
                oldValue: oldValue
              });
            }
          }
        });
      };
      diffRecursive(newObject, oldObject, '');
      if (diff.length > 0) {
        let testPlanId = isTask ? newObject.testPlanId : newObject.serial;
        let operation = '';
        if (isTask) {
          operation = `Update Task#${newObject.serial}: ${newObject.name}`;
        } else {
          operation = 'Update Test Plan';
        }
        return TestPlanModel.recordActivity(testPlanId, {
          user: user,
          type: ActivityType.EDIT,
          date: new Date(),
          operation: operation,
          edits: diff
        });
      } else {
        return newObject;
      }
    } catch (err) {
      logger.error(`Failed to compare and record activity, ${err}`);
      throw err;
    }
  },
  isTaskStateValid: (state) => {
    return state === TaskState.NEW ||
      state === TaskState.IN_PROGRESS ||
      state === TaskState.FINISHED ||
      state === TaskState.DESTRUCTED;
  },
  updateTaskStateByOperation: async (serial, testPlanId, newState, user) => {
    try {
      let oldTask = await TaskModel.findOne({serial: serial, testPlanId: testPlanId});
      let oldState = oldTask.state;
      let task = await TaskModel.findOneAndUpdate({serial: serial, testPlanId: testPlanId}, {$set: {state: newState}}, {new: true});
      let operation = '';
      if (newState === TaskState.IN_PROGRESS) {
        operation = `Start Task#${task.serial}: ${task.name}`;
      } else if (oldState === TaskState.IN_PROGRESS && newState === TaskState.FINISHED) {
        operation = `Close Task#${task.serial}: ${task.name}`;
      } else {
        operation = `Change Task#${task.serial}: ${task.name} state from ${oldState} to ${newState}`;
      }
      await TestPlanModel.recordActivity(testPlanId, {
        user: user,
        type: ActivityType.OPERATE,
        date: new Date(),
        operation: operation
      });
      return task;
    } catch (err) {
      logger.error(`Failed to update task state caused by operation, ${err}`);
      throw err;
    }
  },
  recordAttachmentActivity: async (testPlanSerial, taskSerial, taskName, attachments, isUpload, user) => {
    try {
      let operation = '';
      if (isUpload) {
        operation += 'Upload attachment to ';
      } else {
        operation += 'Delete attachment from ';
      }
      if (!taskSerial) {
        operation += 'Test Plan';
      } else {
        operation += `Task#${taskSerial}: ${taskName}`;
      }
      return TestPlanModel.recordActivity(testPlanSerial, {
        user: user,
        type: ActivityType.OPERATE,
        date: new Date(),
        operation: operation,
        edits: [{
          key: 'attachments',
          newValue: isUpload ? attachments : null,
          oldValue: isUpload ? null : attachments
        }]
      });
    } catch (err) {
      logger.error(`Failed to record attachment activity, ${err}`);
      throw err;
    }
  },
  createComment: async (serial, creator, content) => {
    try {
      let comment = {
        creator: creator,
        create: new Date(),
        content: content
      };
      let testPlan = await TestPlanModel.createComment(serial, comment);
      return testPlan;
    } catch (err) {
      logger.error(`Failed to create comment, ${err}`);
      throw err;
    }
  },
  updateComment: async (serial, _id, editor, content) => {
    try {
      let testPlan = await TestPlanModel.updateComment(serial, _id, editor, content);
      return testPlan;
    } catch (err) {
      logger.error(`Failed to update comment, ${err}`);
      throw err;
    }
  }
};

module.exports = service;
