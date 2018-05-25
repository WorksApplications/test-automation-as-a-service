var logger = require('../logger');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestResultsSchema = new Schema({
  locator: String,
  jobId: Number,
  platform: String,
  branch: String,
  report: String,
  status: String,
  resolved: Boolean,
  failure: Object,
  start: Number,
  stop: Number
});

TestResultsSchema.statics.insert = async function(document) {
  try {
    let ret = await TestResults.create(document);
    logger.info(`TestResults for test case [${document.locator}] of job [${document.jobId}] inserted`);
    return ret;
  } catch (err) {
    logger.error(`create test result failed ${err}`);
  }
};

TestResultsSchema.statics.fetchByBranchAndLocator = async function(branch, locator, platform, limit = 5) {
  try {
    locator = locator.indexOf('+') > 0 ? locator.split('+')[0] : locator;
    let ret = await TestResults.find({branch: branch, locator: locator, platform: platform}, {_id: false, __v: false}).sort({start: -1}).limit(limit);
    logger.info(`TestResults for test case [${locator}] in branch [${branch}] fetched`);
    return ret;
  } catch (err) {
    logger.error(`fetch test result failed ${err}`);
  }
};

TestResultsSchema.statics.fetchByBranchLocatorAndJobId = async function(branch, locator, platform, jobId) {
  try {
    locator = locator.indexOf('+') > 0 ? locator.split('+')[0] : locator;
    let ret = await TestResults.findOne({branch: branch, locator: locator,platform: platform, jobId: jobId}, {_id: false, __v: false}).sort({start: -1});
    logger.info(`[fetchByBranchLocatorAndJobId] TestResults for test case [${locator}] in branch [${branch}] for job [${jobId}] fetched`);
    return ret;
  } catch (err) {
    logger.error(`[fetchByBranchLocatorAndJobId] fetch test result failed ${err}`);
  }
};

TestResultsSchema.statics.fetchByJobId = async function(jobId) {
  try {
    let ret = await TestResults.find({ jobId: jobId }, {_id: false, __v: false});
    logger.info(`[fetchByJobId] TestResults for job [${jobId}] fetched`);
    return ret;
  } catch (err) {
    logger.error(`[fetchByJobId] fetch test result failed ${err}`);
  }
};

TestResultsSchema.statics.updateByResolve = async function(jobId, resolved) {
  try {
    await TestResults.update({jobId: jobId, status: {$ne: 'PASSED'}}, {$set: {resolved: resolved}}, {new: true, multi: true});
    let ret = await TestResults.find({jobId: jobId, status: {$ne: 'PASSED'}}).lean();
    if (ret) {
      return ret;
    }
  } catch (err) {
    logger.error(`[updateByResolve] Failed to update test result by resolve, ${err}`);
    throw err;
  }
};

var TestResults = mongoose.model('TestResults', TestResultsSchema);

module.exports.Model = TestResults;
