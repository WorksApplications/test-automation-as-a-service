var express = require('express');
var recorder = require('./recorder');

var api = express.Router();

api.use('/recorder', recorder);

module.exports = api;
