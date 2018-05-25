var express = require('express');
var bodyParser = require('body-parser');
var logger = require('../logger');
var Preset = require('../models/presets').Model;
var isValidObjId = require('mongoose').Types.ObjectId.isValid;

var jsonParser = bodyParser.json();

var api = express.Router();

api.use('/:id', function(req, res, next) {
  var id = req.params.id;
  if(!isValidObjId(id)) {
    res.status(400).json({success: false, info: 'Invalid ID.'}).end();
    return;
  }
  next();
});

api.post('/', jsonParser, function(req, res) {
  var doc = {
    name: req.body.name,
    branch: req.body.branch,
    url: req.body.url,
    channel: req.body.channel,
    channelId: req.body.channelId,
    username: req.body.username,
    password: req.body.password,
    platform: req.body.platform,
    groups: req.body.groups,
    testcases: req.body.testcases,
    params: req.body.params
  };

  Preset.insert(doc, function(err, rec) {
    if(!err) {
      logger.info(`New preset ${rec.name} is created!`);
      res.status(201).json({success: true, name: rec.name, id: rec._id, info: 'Preset created.'}).end();
    } else {
      res.status(400).json({success: false, info: 'Create failed. ' + err}).end();
    }
  });
});

api.get('/', function(req, res) {
  Preset.list(function(err, rec) {
    if(!err) {
      //logger.info(`New preset ${rec.name} is created!`);
      res.status(200).json({success: true, presets: rec, info: 'OK'}).end();
    } else {
      res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
    }
  });
});

api.get('/:id', function(req, res) {
  var id = req.params.id;
  Preset.retrieve(id, function(err, rec) {
    if(!err && rec) {
      //logger.info(`New preset ${rec.name} is created!`);
      res.status(200).json({success: true, preset: rec._doc, info: 'OK'}).end();
    } else {
      if(err) res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
      else res.status(404).json({success: false, info: 'Document not found'}).end();
    }
  });
});

api.put('/:id', jsonParser, function(req, res) {
  var id = req.params.id;
  var doc = {
    name: req.body.name,
    branch: req.body.branch,
    url: req.body.url,
    channel: req.body.channel,
    channelId: req.body.channelId,
    username: req.body.username,
    password: req.body.password,
    platform: req.body.platform,
    groups: req.body.groups,
    testcases: req.body.testcases,
    params: req.body.params
  };

  Preset.modify(id, doc, function(err, rec) {
    if(!err && rec) {
      res.status(200).json({success: true, preset: rec._doc, info: 'OK'}).end();
    } else {
      if(err) res.status(500).json({success: false, info: 'Update failed. ' + err}).end();
      else res.status(404).json({success: false, info: 'Document not found'}).end();
    }
  });
});

api.delete('/:id', function(req, res) {
  var id = req.params.id;
  var doc = {_id: id};
  Preset.delete(doc, function(err, data) {
    if(!err) {
      if(data) {
        logger.info(`Preset which id = ${id} is deleted!`);
        res.status(200).json({success: true, id: id, info: 'Preset deleted.'}).end();
      } else {
        logger.info(`Preset which id = ${id} doesn't exist!`);
        res.status(404).json({success: false, id: id, info: 'Preset not exists.'}).end();
      }
    } else {
      res.status(500).json({success: false, info: 'Delete failed. ' + err}).end();
    }
  });
});

module.exports = api;
