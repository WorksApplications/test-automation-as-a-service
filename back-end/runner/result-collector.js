const fs = require('fs-extra');
var TestResultModel = require('../models/testresults').Model;
var logger = require('../logger');
var config = require('../config');

/**
 * collect the test report described in xunit
 *
 * @param {Number} jobId the job id of test results
 * @param {Object} xunitData json object of the xunit
 * @param {String} dataFolder source folder, where ${dataFolder} contains all the json files including xunit.json
 * @returns {Array} Array of test ressults
 *
 */
async function collectAndSaveTestReport(dataFolder, xunitData, jobId, platform, branch, reportUrl) {
  let results = [];
  for (let i = 0 ; i < xunitData.testSuites.length; i++) {
    let testSuite = xunitData.testSuites[i];
    for (let j = 0 ; j < testSuite.testCases.length; j++) {
      let testCase = testSuite.testCases[j];
      let uid = testCase.uid;
      let filePath = `${dataFolder}/${uid}-testcase.json`.replace('//', '/');
      let testResult = await fs.readJson(filePath);
      // locator is defined using package.class#method
      let labelTestcase = testResult.labels.find(label => label.name === 'testClass');
      let labelTestMethod = testResult.labels.find(label => label.name === 'testMethod');
      if (!labelTestcase || !labelTestMethod) {
        logger.info(`testClass or testMethod label not exist, unable to collect result for test case uid=${uid}`);
      } else {
        let locator = labelTestcase.value + '#' + labelTestMethod.value;
        let failure = testResult.failure;
        let screenshot = undefined;
        if (testResult.attachments) {
          let imgAttach = testResult.attachments.find(a => a.title === 'Failure screenshot');
          if (imgAttach) {
            screenshot = `${config.server.report}/${jobId}/data/${imgAttach.source}`;
          }
        }

        if (failure && failure.message && screenshot) {
          failure.screenshot = screenshot;
        }
        let resultObj = {
          locator: locator,
          jobId: jobId,
          platform: platform,
          branch: branch,
          report: reportUrl,
          status: testResult.status,
          failure: failure,
          start: testResult.time.start,
          stop: testResult.time.stop
        };
        results.push(TestResultModel.insert(resultObj));
      }
    }
  }
  return global.Promise.all(results);
}

module.exports = {
  collectAndSaveTestReport
};
