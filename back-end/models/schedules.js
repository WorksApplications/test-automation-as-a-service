var mongoose = require('mongoose');
var logger = require('../logger');
var PresetSchema = require('./presets').Schema;
var cronParser = require('cron-parser');
var moment = require('moment-timezone');
var countAndFind = require('mongoose-count-and-find');

var Schema = mongoose.Schema;

/*
   The limit of schedules' name is 80.
   The name of a test job triggered automatically will be the schedule's name followed by `_scheduled_#` (len=12) then followed by a number.
   To prevent the auto-generated name exceed the limit of test jobs' name, we've set the limit of test job's name to 60,
   allows a 100-80-12=8 bytes serial number which is more than enough.
*/
var ScheduleSchema = new Schema({
  serial: Number,
  count: Number,
  name: {type: String, validate: /^\S.{0,80}$/},
  cron: {type: String, validate: [function(cron) {
    try {
      cronParser.parseExpression(cron);
    } catch (err) {
      return false;
    }
    return true;
  }, 'Cron expression invalid'], required: true},
  timezone: {type: String, validate: [function(tz) {
    if(!tz || !tz.length || tz.length < 3) return false;
    return moment.tz.zone(tz) ? true : false;
  }, 'Timezone Invalid'], required: true},
  enabled: Boolean,
  lastRun: Date,
  nextRun: Date,
  params: PresetSchema
});

ScheduleSchema.plugin(countAndFind);

/**
 * Unfold a nested object to a linear structure
 *
 * @param {any} obj An object for process
 */
function unfoldObject(obj) {
  var ret = {};
  (function search(result, obj, prefix) {
    for(var key in obj) {
      if(typeof obj[key] === 'object' && !Array.isArray(obj[key]))
        search(result, obj[key], prefix + key + '.');
      else result[prefix + key] = obj[key];
    }
  })(ret, obj, '');
  return ret;
}

function updateNextRun(serial, callback) {
  Schedule.findOne({serial: serial}, function(err, data) {
    var nextRun = cronParser.parseExpression(data.cron, {tz: data.timezone}).next();
    Schedule.findOneAndUpdate({serial: serial}, data.enabled ? {$set: {nextRun: nextRun}} : {$unset: {nextRun: ''}}, {new: true}, function(err, data) {
      logger.debug(`Update next run time to ${data.enabled ? nextRun.toString() : 'NEVER'}`);
      if(callback) callback(err, data);
    });
  });
}

ScheduleSchema.statics.createSchedule = function(doc, callback) {
  Schedule.create(doc, function(err, data) {
    if(err) {
      logger.error('Failed to create a schedule in the DB. ' + err);
      if(callback) callback(err, data);
    } else {
      logger.info(`Schedule #${data.serial}: ${data.name} is successfully created in the DB.`);
      updateNextRun(data.serial, function(err) {
        if(callback) callback(err, data);
      });
    }
  });
};

ScheduleSchema.statics.updateSchedule = function(serial, doc, callback) {
  var set = unfoldObject(doc);
  Schedule.findOneAndUpdate({serial: serial}, {$set: set}, {new: false}, function(err, data) {
    if(!err && data) {
      updateNextRun(serial, function(err) {
        callback(err, data);
      });
    } else {
      if(err) logger.error('Failed to update a schedule in the DB. ' + err);
      else logger.error(`Schedule with serial = ${serial} is not found.`);
      if(callback) callback(err, data);
    }
  });
};

ScheduleSchema.statics.removeSchedule = function(serial, callback) {
  Schedule.findOneAndRemove({serial: serial}, function(err, data) {
    if(err) logger.error('Failed to remove a schedule in the DB. ' + err);
    if(callback) callback(err, data);
  });
};

ScheduleSchema.statics.list = function(showAll, skip, limit) {
  return new global.Promise(function(resolve, reject) {
    var receiveResultSet = function(err, data, count) {
      if(err) {
        logger.error('Failed to list schedules from the DB. ' + err);
        reject(err);
      } else {
        resolve({data: data, count: count});
      }
    };

    // showAll = false: only enabled
    // showAll = true:  all (but apply later filters)

    var filter = {};
    if (showAll === 1){
      Schedule.countAndFind(filter).skip(skip)
        .limit(limit)
        .select({_id: false, log: false, 'params._id': false, __v: false})
        .sort({serial: 'asc'})
        .exec(receiveResultSet);
    } else {
      filter.enabled = true;
      Schedule.countAndFind(filter)
        .exec(receiveResultSet);
    }
  });
};

ScheduleSchema.statics.retrieve = function(serial, callback) {
  var receiveResultSet = function(err, data) {
    if(err) logger.error('Failed to retrieve a schedule fron the DB. ' + err);
    if(callback) callback(err, data);
  };
  Schedule.find({serial: serial}).select({_id:false, __v: false, 'params._id': false}).exec(receiveResultSet);
};

ScheduleSchema.statics.saveTriggeringInfo = function(serial, cron, timezone, callback) {
  var nextRun = cronParser.parseExpression(cron, {tz: timezone}).next();
  Schedule.findOneAndUpdate({serial: serial}, {$inc: {count: 1}, $set: {lastRun: new Date(), nextRun: nextRun}}, {new: true, upsert: true}, function(err, data) {
    if(err) logger.error('Failed to increase schedule counter. ' + err);
    if(callback) callback(err, data);
  });
};

var Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports.Model = Schedule;
module.exports.Schema = ScheduleSchema;
