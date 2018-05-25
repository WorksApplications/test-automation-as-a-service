var express = require('express');
var fs = require('fs');
var NodeModel = require('../models/nodes').Model;
// the appId is used to redirect for login from Genius Center
let appId = require('../config').auth.app_id;

//var runner = require('../runner/runner');

var api = express.Router();

api.get('/', function(req, res) {
  fs.readFile(global.__base + '/sysinfo.json', function(err, data) {
    var json = JSON.parse(data.toString());
    var info = {};
    info.version = json.version;
    info.nodeVersion = process.version;
    info.memory = process.memoryUsage();
    info.cpu = process.cpuUsage();
    info.commit = json.commit;
    info.buildNum = json.buildNum;
    info.buildDate = new Date(json.buildDate);
    info.serverDate = new Date();
    info.uptime = process.uptime();
    info.appId = appId;
    res.status(200).json(info).end();
  });
});

api.get('/liveurls', function(req, res) {
  (async () => {
    //await runner.loadNodes();
    var ret = await NodeModel.listLiveUrls();
    var nodes = [];
    for(var i = 0; i < ret.length; i++) {
      var node = {};
      node.id = ret[i]._id;
      node.height = ret[i].height;
      node.width = ret[i].width;
      node.url = ret[i].liveUrl;
      node.name = ret[i].name;
      node.platform = ret[i].platform;
      node.vncHost = ret[i].vncHost;
      node.vncPort = ret[i].vncPort;
      node.vncPassword = ret[i].vncPassword;
      nodes.push(node);
    }
    res.status(200).json(nodes).end();
  })().catch(err => res.status(200).json({success: false, info: err}).end());
});

module.exports = api;
