const express = require('express');
const bodyParser = require('body-parser');
const SettingService = require('../service/setting-service');

const api = express.Router();
const jsonParser = bodyParser.json();

api.put('/testcases', jsonParser, async (req, res) => {
  let username = req.user.username;
  let testcases = req.body;
  try {
    let ret = await SettingService.updateTestcases(username, testcases);
    res.status(200).json({success: true, testcases: ret.testcases}).end();
  } catch (error) {
    res.status(500).json({success: false, info: error}).end();
  }
});

api.get('/testcases', async (req, res) => {
  let username = req.user.username;
  try {
    let ret = await SettingService.retrieveTestcases(username);
    res.status(200).json({success: true, testcases: ret.testcases}).end();
  } catch (error) {
    res.status(500).json({success: false, info: error}).end();
  }
});

module.exports = api;