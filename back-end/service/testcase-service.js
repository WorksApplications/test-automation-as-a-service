const TestcaseModel = require('../models/testcases').Model;
const logger = require('../logger');
const key = require('mongo-key-escape');

const service = {
  async getTestcasesByLocatorPrefix (branch, prefixs) {
    try {
      let results = prefixs.map(async className => {
        let record = await TestcaseModel.retrieve(branch);
        let result = [];
        if (record && record.testcases) {
          let testcases = record.testcases;
          testcases = JSON.parse(key.unescape(JSON.stringify(testcases)));
          let stack = [testcases];
          while (stack.length > 0) {
            let top = stack.pop();
            if (top.testcases) {
              let tmpResult = top.testcases.filter(tc => tc.locator.startsWith(className));
              if (tmpResult.length > 0) {
                tmpResult.map(tmp => tmp.locator).forEach(testcase => result.push(testcase));
              }
            }
            let keys = Object.keys(top);
            for(let key of keys) {
              if (!key.startsWith('taas_') && key !== 'testcases') {
                stack.push(top[key]);
              }
            }
          }
        }
        return result;
      });
      return global.Promise.all(results);
    } catch (err) {
      logger.error(`Failed to fetch test cases for branch ${branch} by prefix ${prefixs}.` + err);
      return global.Promise.reject(`${err}`);
    }

  }
};

module.exports = service;

