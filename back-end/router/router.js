var express = require('express');
var testjobs = require('./testjobs');
var presets = require('./presets');
var groups = require('./groups');
var schedules = require('./schedules');
var sysinfo = require('./sysinfo');
var branches = require('./branches');
var channels = require('./channels');
var webhook = require('./webhook');
var testcases = require('./testcases');
var dashboard = require('./dashboard');
var testcode = require('./testcode');
var testresults = require('./testresults');
var auth = require('./auth');
var userRouter = require('./user');
var testPlanRouter = require('./testplan');
var avatar = require('./avatar');
var settings = require('./settings');

var api = express.Router();

api.use('/testjobs', testjobs);
api.use('/presets', presets);
api.use('/groups', groups);
api.use('/schedules', schedules);
api.use('/sysinfo', sysinfo);
api.use('/branches', branches);
api.use('/channels', channels);
api.use('/testcases', testcases);
api.use('/dashboard', dashboard);
api.use('/testcode', testcode);
api.use('/testresults', testresults);
api.use('/auth', auth);
api.use('/user', userRouter);
api.use('/testplans', testPlanRouter);
api.use('/avatar', avatar);
api.use('/settings', settings);

api.use('/internal/testjobs', testjobs); // no auth check
api.use('/app/testjobs', testjobs); // api token auth
api.use('/app/webhook', webhook); // api token auth

module.exports = api;
