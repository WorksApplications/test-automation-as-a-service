const logger = require('../logger');

var TestJobModel = require('../models/testjobs').Model;
var TestResultModel = require('../models/testresults').Model;
var TestJobStatus = require('../models/testjobs').Status;
var DashboardModel = require('../models/dashboard').Model;
var TestPlanService = require('../service/testplan-service');
var TaskState = require('../models/task').State;

const service = {
  updateResolve: async (serial, resolve) => {
    try {
      var testjob = await TestJobModel.updateResolve(serial, resolve);
      if (testjob) {
        var testresults = await TestResultModel.updateByResolve(serial, resolve.resolved);
        var testPlanSerial = testjob.testPlanSerial;
        var taskSerial = testjob.taskSerial;
        if (testPlanSerial && taskSerial) {
          var filter = {
            status: TestJobStatus.FINISHED,
            testPlanSerial: testPlanSerial,
            taskSerial: taskSerial
          };
          var finishedTestJob = await TestJobModel.find(filter).select('serial').sort({serial: -1}).limit(1);
          if (finishedTestJob[0].serial === parseInt(serial)) {
            await DashboardModel.updateTestResults(testresults[0].branch, testresults);
            if (testPlanSerial && taskSerial) {
              var task = await TestPlanService.findTaskBySerial(taskSerial, testPlanSerial);
              if (resolve.resolved) {
                task.state = TaskState.FINISHED;
                task.verdict.result = resolve.reason;
                task.verdict.reason = resolve.comment;
              } else {
                task.state = TaskState.IN_PROGRESS;
                task.verdict.result = '';
                task.verdict.reason = '';
              }
              await TestPlanService.updateTaskBySerial(taskSerial, testPlanSerial, task);
            }
          }
        }
        return testjob;
      }
    } catch (err) {
      logger.error(`Failed to update resolve info of test job #${serial}, ${err}`);
      throw err;
    }
  }
};

module.exports = service;