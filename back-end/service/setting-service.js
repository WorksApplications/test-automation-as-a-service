
let logger = require('../logger');
const SettingModel = require('../models/settings').Model;

const service = {
  updateTestcases: async (username, testcases) => {
    try {
      let setting = await SettingModel.findOneAndUpdate({
        username: username
      }, {
        $set: { testcases: testcases }
      }, {
        new: true,
        upsert: true
      }).lean();
      if (setting) {
        return setting;
      } else {
        throw new Error(`User ${username} not found`);
      }
    }
    catch (error) {
      logger.error(`Failed to update test cases of ${username}, ${error}`);
      throw error;
    }
  },
  retrieveTestcases: async (username) => {
    try {
      let testcases = await SettingModel.findOne({ username: username }, { testcases: true }).lean();
      if (testcases) {
        return testcases;
      } else {
        throw new Error(`User ${username} not found`);
      }
    } catch (error) {
      logger.error(`Failed to retrieve test cases of ${username}`);
      throw error;
    }
  }
};

module.exports = service;