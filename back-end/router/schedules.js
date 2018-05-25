var express = require('express');
var bodyParser = require('body-parser');
var ScheduleModel = require('../models/schedules').Model;
var scheduler = require('../runner/scheduler');

var jsonParser = bodyParser.json();

var api = express.Router();

api.post('/', jsonParser, function(req, res) {
  scheduler.createSchedule(req.body.name, req.body.cron, req.body.timezone, req.body.params, req.body.enabled, function(err, data) {
    if(!err) {
      res.status(201).json({success: true, info: 'Schedule is created.', serial: data.serial, nextRun: data.nextRun}).end();
    } else {
      res.status(400).json({success: false, info: 'Failed to create a schedule. ' + err}).end();
    }
  });
});

api.put('/:serial', jsonParser, function(req, res) {
  var serial = req.params.serial;
  scheduler.updateSchedule(serial, req.body, function(err, data) {
    if(!err) {
      if(data) res.status(200).json({success: true, info: 'Schedule updated.', nextRun: data.nextRun}).end();
      else res.status(404).json({success: false, info: 'Schedule not found.'}).end();
    } else {
      res.status(500).json({success: false, info: 'Failed to update a schedule. ' + err});
    }
  });
});

api.delete('/:serial', function(req, res) {
  var serial = req.params.serial;
  scheduler.removeSchedule(serial, function(err, data) {
    if(!err) {
      if(data) res.status(200).json({success: true, info: 'Schedule removed.'}).end();
      else res.status(404).json({success: false, info: 'Schedule not found.'}).end();
    } else {
      res.status(500).json({success: false, info: 'Failed to remove a schedule. ' + err});
    }
  });
});

api.get('/', function(req, res) {
  var skip = parseInt(req.query.skip) || 0;
  var limit = parseInt(req.query.limit) || 100;
  var showAll = parseInt(req.query.showAll) || 0;
  ScheduleModel.list(showAll, skip, limit).then(schedules => {
    res.status(200).json({success: true, info: 'OK', count: schedules.count, schedules: schedules.data}).end();
  }).catch(err => {
    res.status(500).json({success: false, info: 'Failed to list schedules. ' + err}).end();
  });
});

api.get('/:serial', function(req, res) {
  var serial = req.params.serial;
  ScheduleModel.retrieve(serial, function(err, data) {
    if(!err) {
      if(data && data.length) res.status(200).json({success: true, info: 'OK', schedules: data[0]}).end();
      else res.status(404).json({success: false, info: 'Schedule not found.'}).end();
    } else {
      res.status(500).json({success: false, info: 'Failed to retrieve a schedule. ' + err}).end();
    }
  });
});

module.exports = api;
