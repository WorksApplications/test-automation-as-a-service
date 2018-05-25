let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let LogEntry = {
  level: String,
  timestamp: Date,
  message: String
};

let LogSchema = new Schema({
  serial: Number,
  log: [LogEntry]
});

let logCache = {};

function initLog(serial) {
  if(!logCache[serial]) {
    logCache[serial] = {serial: serial, log: []};
  }
}

LogSchema.statics.initLog = initLog;

LogSchema.statics.appendLog = function(serial, log) {
  initLog(serial);
  logCache[serial].log.push(log);
};

LogSchema.statics.flushLog = async function(serial) {
  if(!logCache[serial]) return new global.Promise((resolve) => resolve());
  try {
    let ret = await Log.create(logCache[serial]);
    delete logCache[serial];
    return ret;
  } catch (err) {
    logger.error('Failed to save logs. ' + err);
    throw err;
  }
};

LogSchema.statics.retrieve = async function(serial, logSkip, logLimit) {
  if(logCache[serial]) return new global.Promise((resolve) => {
    let start = logSkip ? logSkip : 0;
    let end = logLimit ? start + logLimit : undefined;
    resolve({serial: serial, log: logCache[serial].log.slice(start, end)});
  });
  try {
    let ret = await Log.findOne({serial: serial})
      .select({_id: false, __v: false, 'log._id': false})
      .exec();
    return ret;
  } catch (err) {
    logger.error('Failed to retrieve logs. ' + err);
    throw err;
  }
};

let Log = mongoose.model('Log', LogSchema);

module.exports.Model = Log;
module.exports.Schema = LogSchema;
