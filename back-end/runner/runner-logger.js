let logger = require('../logger');
let LogModel = require('../models/logs').Model;
let SocketService = require('../service/socket-service');

module.exports.terminalLogger = function(log, serial, level) {
  logger.log(level, log);
  let logWithLevelAndTime = {level: level, timestamp: new Date(), message: log};
  LogModel.appendLog(serial, logWithLevelAndTime);
  SocketService.broadcastToTestJobUserOrGroups('log', serial, {forceToAllUsers: true}, logWithLevelAndTime);
};
