let _ = require('lodash');
let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;
var key = require('mongo-key-escape');
var TestJobModel = require('./testjobs').Model;

let DashboardSchema = new Schema({
  branch: String,
  date: Date,
  testresults: Object
}, { retainKeyOrder: true });

const updateKeysFromTestcases = (testresults, testcases) => {
  let tmp = _.cloneDeep(testresults);

  const recursive = (testresults, testcases) => {
    let testcasesKeySet = Object.keys(testcases);

    // remove update
    for (let key in testresults) {
      if (testcasesKeySet.indexOf(key) < 0) {
        delete testresults[key];
      } else {
        if (key.startsWith('taas_')) {
          testresults[key] = testcases[key];
        } else if (key === 'testcases') {
          let newTestcases = _.cloneDeep(testcases.testcases);
          newTestcases.forEach(testcase => {
            let testcaseMatched = testresults.testcases.find(tc => tc.locator === testcase.locator);
            testcase.testResults = testcaseMatched ? testcaseMatched.testResults : {};
            testcase.rating = (testcaseMatched.rating || testcaseMatched.rating === 0) ? testcaseMatched.rating : undefined;
          });
          testresults.testcases = newTestcases;
        } else {
          if (!(key in testresults)) {
            testresults[key] = testcases[key];
          } else {
            recursive(testresults[key], testcases[key]);
          }
        }
      }
    }

    let dashboardKeySet = Object.keys(testresults);
    // add
    for (let key in testcases) {
      if (dashboardKeySet.indexOf(key) < 0) {
        testresults[key] = testcases[key];
      }
    }
  };

  recursive(tmp, testcases);
  return tmp;
};

DashboardSchema.statics.retrieve = async function(branch) {
  try {
    let ret = await Dashboard.findOne({ branch: branch }, { _id: false, __v: false });
    logger.info(`Retrieve Dashboard item for branch ${branch} succeed`);
    ret = JSON.parse(key.unescape(JSON.stringify(ret)));
    return ret;
  } catch (e) {
    logger.error(`Failed to retrieve dashboard item for branch ${branch}, ${e}`);
  }
};

/**
 * update keys according to given `testcases` object
 * remove the removed keys
 * add the new keys
 */
DashboardSchema.statics.updateKeys = async function(branch, testcases) {
  try {
    let ret = await Dashboard.findOne({ branch: branch}, {_id: false, __v: false});
    ret = JSON.parse(key.unescape(JSON.stringify(ret)));
    ret = updateKeysFromTestcases(ret ? ret.testresults : {}, testcases);
    let updateResult = await Dashboard.update({ branch: branch }, {
      branch: branch,
      date: new Date(),
      testresults: ret
    }, {new: true, upsert: true});

    return updateResult;
  } catch (e) {
    logger.error(`Failed to update keys for branch ${branch}, ${e}`);
  }
};

const insertTestResults = async (testResults, newTestResults) => {
  const testjob = await TestJobModel.retrieve(newTestResults[0].jobId);
  const testPlanSerial = testjob.testPlanSerial;
  const taskSerial = testjob.taskSerial;

  const recursive = (testResults, newTestResults) => {
    for (let key in testResults) {
      if (key.startsWith('taas_')) {
        continue;
      } else if (key === 'testcases') {
        for (let i = 0; i < testResults[key].length; i++) {
          let testcase = testResults[key][i];
          let matchedTestResult = newTestResults.find(tc => testcase.locator.indexOf(tc.locator) >= 0);

          if (matchedTestResult) {
            testcase.testResults = testcase.testResults || {};
            let result = matchedTestResult.status !== 'PASSED' && matchedTestResult.resolved ? 'RESOLVED' : matchedTestResult.status;
            // For all
            testcase.testResults[matchedTestResult.platform] = result;
            if (testcase.rating === undefined || testcase.rating === null) testcase.rating = 50;
            if (matchedTestResult.status === 'PASSED') {
              testcase.rating = Math.round(testcase.rating * 0.8 + 102 * 0.2);
            } else {
              testcase.rating = Math.round(testcase.rating * 0.8 - 2 * 0.2);
            }
            // For test plan and task
            if (testPlanSerial) {
              testcase.testResults[testPlanSerial] = testcase.testResults[testPlanSerial] || {};
              testcase.testResults[testPlanSerial][matchedTestResult.platform] = result;
              if (taskSerial) {
                testcase.testResults[testPlanSerial][taskSerial]
                  = testcase.testResults[testPlanSerial][taskSerial] || {};
                testcase.testResults[testPlanSerial][taskSerial][matchedTestResult.platform] = result;
              }
            }
          }
        }
      } else {
        recursive(testResults[key], newTestResults);
      }
    }
  };

  recursive(testResults, newTestResults);
};
/**
 * update test results in dashboard upon execution finished
 *
 * @param {String} branch the branch name
 * @param {Array[Object]} testResults the test results array
 * @returns {Object} the updated document
 */
DashboardSchema.statics.updateTestResults = async function(branch, testResults) {
  try {
    let dashboard = await Dashboard.findOne({ branch: branch}, {branch: true, testresults: true});
    dashboard = JSON.parse(key.unescape(JSON.stringify(dashboard)));

    await insertTestResults(dashboard.testresults, testResults);
    let updateResult = await Dashboard.update({ branch: branch }, {
      branch: branch,
      date: new Date(),
      testresults: JSON.parse(key.escape(JSON.stringify(dashboard.testresults)))
    }, {new: true, upsert: true});

    return updateResult;
  } catch (e) {
    logger.error(`update test results failed, ${e}`);
  }
};

let Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports.Model = Dashboard;

