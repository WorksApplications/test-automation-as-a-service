var mongoose = require('mongoose');
var logger = require('../logger');
var PresetSchema = require('./presets').Schema;
var countAndFind = require('mongoose-count-and-find');
var LogModel = require('./logs').Model;
var StepModel = require('./steps').Model;
var ExecStackModel = require('./exec-stack').Model;

var Status = {
  PENDING: 'Pending',
  RUNNING: 'Running',
  CANCELED: 'Canceled',
  FINISHED: 'Finished',
  ERROR: 'Error'
};

var TypeJob = {
  NORMAL: 'Normal',
  GRP_CASES_SCAN: 'Group&CasesScan',
  BRH_SCAN: 'BranchScan',
  API: 'Api'
};

var TypeTrigger = {
  NORMAL: 'Normal',
  SCHEDULED: 'Scheduled',
  TASKED: 'Tasked',
};

var Schema = mongoose.Schema;

var ResultSchema = new Schema({
  total: Number,
  passed: Number,
  pending: Number,
  canceled: Number,
  failed: Number,
  broken: Number
});

var ResolveSchema = new Schema({
  resolved: Boolean,
  reason: {type: String, validate: /^.{0,100}$/},
  comment: {type: String, validate: /^.{0,300}$/}
});

var TestJobSchema = new Schema({
  operator: String,
  serial: Number,
  scheduleSerial: Number,
  testPlanSerial: Number,
  taskSerial: Number,
  create: Date,
  start: Date,
  finish: Date,
  status: String,
  typeJob: String,
  typeTrigger: String,
  report: String,
  vncHost: String,
  vncPort: String,
  vncPassword: String,
  videoAvailable: Boolean,
  result: ResultSchema,
  params: PresetSchema,
  resolve: ResolveSchema
});

TestJobSchema.plugin(countAndFind);

TestJobSchema.statics.createTestJob = async function(doc) {
  try {
    var ret = await TestJob.create(doc);
    return ret;
  } catch (err) {
    logger.error('Failed to create a test job in the DB. ' + err);
  }
};

TestJobSchema.statics.updateStatus = async function(serial, status) {
  try {
    var ret = await TestJob.findOneAndUpdate({serial: serial}, {$set: {status: status}}, {new: true});
    if(ret) {
      if(status === Status.RUNNING) {
        LogModel.initLog(serial);
        StepModel.initStep(serial);
        ExecStackModel.initExecStack(serial);
      } else {
        LogModel.flushLog(serial);
        StepModel.flushSteps(serial);
        ExecStackModel.flushExecStack(serial);
      }
    }
    return ret;
  } catch (err) {
    logger.error('Failed to update the job status in the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.getStatus = async function(serial) {
  try {
    var ret = await TestJob.findOne({serial: serial}, {serial: true, status: true});
    if(ret) return ret.status;
    else return null;
  } catch (err) {
    logger.error('Failed to update the job status in the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.updateReport = async function(serial, report) {
  try {
    var ret = await TestJob.findOneAndUpdate({serial: serial}, {$set: {report: report.reportUrl, result: report.result}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to update a report in the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.updateProgress = async function(serial, progress) {
  try {
    var ret = await TestJob.findOneAndUpdate({serial: serial}, {$inc: progress}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to update a report in the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.updateResolve = async function(serial, resolve) {
  try {
    var testjob = await TestJob.findOne({serial: serial}, {serial: true, status: true, result: true});
    if (testjob.status !== Status.FINISHED || testjob.result['passed'] === testjob.result.total) {
      // Verify on test job: Only test job that is finished and has failed test cases can be resolved
      throw new Error('Test job status should be finished and test cases should not be all-passed.');
    } else {
      // Verify on request body:
      if (resolve.resolved && resolve.reason === '') {
        throw new Error('Test job cannot be resolved without reason.');
      } else if (resolve.resolved && (resolve.reason.length > 100 || resolve.comment.length > 300)) {
        throw new Error('Resolve reason and comment should less than 100 and 300 characters respectively.');
      } else if (!resolve.resolved && (resolve.reason !== '' || resolve.comment !== '')) {
        throw new Error('Test job cannot be unresolved with reason or comment.');
      } else {
        var ret = await TestJob.findOneAndUpdate({serial: serial}, {$set: {resolve: resolve}}, {new: true});
        return ret;
      }
    }
  } catch (err) {
    logger.error('Failed to update a resolve in the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.list = function(skip, limit, showAll, schedule, testPlan, task, branch, locator) {
  return new global.Promise(function(resolve, reject) {
    var receiveResultSet = function(err, data, count) {
      if(err) {
        logger.error('Failed to list test jobs from the DB. ' + err);
        reject(err);
      } else {
        resolve({data: data, count: count});
      }
    };

    var filter;
    if(showAll) filter = {};
    else filter = { $and: [
      { typeJob: { $ne: TypeJob.BRH_SCAN } },
      { type: { $ne: TypeJob.BRH_SCAN } },
      { typeJob: { $ne: TypeJob.GRP_CASES_SCAN } },
      { type: { $ne: TypeJob.GRP_CASES_SCAN } }
    ]};

    if(schedule) filter.scheduleSerial = schedule;
    if(testPlan) filter.testPlanSerial = testPlan;
    if(task) filter.taskSerial = task;
    if(branch) filter['params.branch'] = branch;
    if(locator) {
      filter['params.testcases'] = {
        '$in': [ locator ]
      };
    }

    // We cannot simply `await` here because `countAndFid` is a mongoose plugin which not supports Promise
    TestJob.countAndFind(filter).skip(skip)
      .limit(limit)
      .select({_id: false, log: false, 'params._id': false, __v: false})
      .sort({serial: 'desc'})
      .exec(receiveResultSet);
  });
};

TestJobSchema.statics.listPendingJobs = async function() {
  try {
    var pendingJobs = await TestJob.find({$or: [{status: 'Pending'}, {status: 'Running'}]})
      .select({_id: false, log: false, 'params._id': false, __v: false})
      .sort({serial: 'asc'})
      .exec();
    return pendingJobs;
  } catch (err) {
    logger.error('Failed to list pending jobs from the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.retrieve = async function(serial, logSkip, logLimit) {
  try {
    var ret = await TestJob.findOne({serial: serial})
      .select({_id: false, 'params._id': false, __v: false, 'result._id': false})
      .exec();
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve a test job from the DB. ' + err);
    throw err;
  }
};

TestJobSchema.statics.recordFinishTime = async function(serial, finishTime) {
  try {
    var ret = await TestJob.update({serial: serial}, {$set: {finish: finishTime}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to record finish time. ' + err);
    throw err;
  }
};

TestJobSchema.statics.recordStartTime = async function(serial, startTime) {
  try {
    var ret = await TestJob.update({serial: serial}, {$set: {start: startTime}}, {new: true});
    return ret;
  } catch (err) {
    logger.error('Failed to record start time. ' + err);
    throw err;
  }
};

TestJobSchema.statics.recordLiveInfo = async function(serial, host, port, password) {
  try {
    var doc = {vncHost: host, vncPort: port};
    if(password) doc.vncPassword = password;
    var res = await TestJob.update({serial: serial}, {$set: doc}, {new: true});
    return res;
  } catch (err) {
    logger.error('Failed to record live info. ' + err);
    throw err;
  }
};

var TestJob = mongoose.model('TestJob', TestJobSchema);

module.exports.Status = Status;
module.exports.TypeJob = TypeJob;
module.exports.TypeTrigger = TypeTrigger;
module.exports.Model = TestJob;
module.exports.Schema = TestJobSchema;
