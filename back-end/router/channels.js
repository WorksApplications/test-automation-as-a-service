var express = require('express');
var slackbot = require('../runner/slackbot');
var Channel = require('../models/channels').Model;

var api = express.Router();

api.get('/', function(req, res) {
  Channel.retrieve(function(err, data) {
    if(!err) {
      if(data) res.status(200).json({success: true, lastUpdate: data.date, channels: data.channels}).end();
      else res.status(200).json({success: true, channels: []}).end();
    } else {
      res.status(500).json({success: false, info: 'Retrieve failed. ' + err}).end();
    }
  });
});

api.put('/', function(req, res) {
  slackbot.listChannels(function(err, channels) {
    if(!err) {
      Channel.modify(channels, function(err, data) {
        res.status(201).json({success: true, info: 'Slack channels list is updated.', lastUpdate: data.date, channels: data.channels}).end();
      });
    } else {
      res.status(500).json({success: false, info: 'Internal error. ' + err}).end();
    }
  });
});

module.exports = api;
