var logger =  require('../logger');
var TestJobStatus = require('../models/testjobs').Status;
var TestPlanState = require('../models/testplan').State;
var TaskState = require('../models/task').State;
var TestJobModel = require('../models/testjobs').Model;
var TestPlanModel = require('../models/testplan').Model;
var TaskModel = require('../models/task').Model;
var SocketService = require('../service/socket-service');

async function setStatus(serial, status, time) {
  if(!time) time = new Date();
  await TestJobModel.updateStatus(serial, status);
  await SocketService.broadcastToTestJobUserOrGroups('status', serial, {forceToAllUsers: true}, status);
  logger.debug(`Job #${serial} is updated to ${status} status.`);
  await TestJobModel.recordFinishTime(serial, time);
  logger.debug(`${status} time recorded.`);
}

module.exports.getStatus = async function(serial) {
  var ret = await TestJobModel.getStatus(serial);
  return ret;
};

module.exports.setRunning = async function(serial, testPlanSerial, taskSerial, startTime) {
  if(!startTime) startTime = new Date();
  await TestJobModel.updateStatus(serial, TestJobStatus.RUNNING);
  await SocketService.broadcastToTestJobUserOrGroups('status', serial, {forceToAllUsers: true}, TestJobStatus.RUNNING);
  logger.debug(`Job #${serial} is updated to Running status.`);
  if (testPlanSerial && taskSerial) {
    await TestPlanModel.updateState(testPlanSerial, TestPlanState.IN_PROGRESS);
    await TaskModel.updateState(taskSerial, testPlanSerial, TaskState.IN_PROGRESS);
    logger.debug(`Test plan #${testPlanSerial} and Task #${taskSerial} are updated to In Progress state.`);
  }
  await TestJobModel.recordStartTime(serial, startTime);
  logger.debug('Start time recorded.');
};

module.exports.setFinished = async function(serial, report, finishTime) {
  await setStatus(serial, TestJobStatus.FINISHED, finishTime);
  if(report) {
    await TestJobModel.updateReport(serial, report);
    logger.debug(`Test report #${serial} saved.`);
    if (report.result.passed === report.result.total) {
      var testjob = await TestJobModel.retrieve(serial);
      if (testjob.testPlanSerial && testjob.taskSerial) {
        await TaskModel.updateState(testjob.taskSerial, testjob.testPlanSerial, TaskState.FINISHED);
        logger.debug(`Task #${testjob.taskSerial} is updated to Finished state`);
      }
    }
  }
};

module.exports.setCanceled = async function(serial, finishTime) {
  await setStatus(serial, TestJobStatus.CANCELED, finishTime);
};

module.exports.setError = async function(serial, finishTime) {
  await setStatus(serial, TestJobStatus.ERROR, finishTime);
};
