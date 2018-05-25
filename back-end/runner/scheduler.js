let ScheduleModel = require('../models/schedules').Model;
let jobScheduler = require('node-schedule-tz');
let runner = require('./runner');
let logger = require('../logger');
let counter = require('../counter');
let SocketService = require('../service/socket-service');

let scheduleCounter = counter('scheduleCounter');

function createRamSchedule(schedule) {
  jobScheduler.scheduleJob(schedule.serial.toString(), schedule.cron, schedule.timezone, function() {
    // Actual scheduled job
    ScheduleModel.saveTriggeringInfo(schedule.serial, schedule.cron, schedule.timezone, function(err, updatedSchedule) {
      if(!err) {
        // Counter increased. Create a test job
        logger.info(`Auto triggering ${updatedSchedule.name} for the #${updatedSchedule.count} time.`);
        runner.createTestJob({
          name:`${updatedSchedule.name} (Executed from #S${schedule.serial})`,
          branch: updatedSchedule.params.branch,
          url: updatedSchedule.params.url,
          appUrl: updatedSchedule.params.appUrl,
          channel: updatedSchedule.params.channel,
          channelId: updatedSchedule.params.channelId,
          username: updatedSchedule.params.username,
          password: updatedSchedule.params.password,
          platform: updatedSchedule.params.platform,
          groups: updatedSchedule.params.groups,
          testcases: updatedSchedule.params.testcases,
          params:  updatedSchedule.params.params
        }, {
          scheduleSerial: schedule.serial
        }, function(err, triggerdJob) {
          if(!err && triggerdJob) {
            logger.info(`Test job #${triggerdJob.serial} is successfully triggered by schedule ${updatedSchedule.name}.`);
          }
        });
      } else {
        logger.error('Failed to update the triggering info. ' + err);
      }
      SocketService.broadcastScheduleTrigger(schedule.serial);
    });
  });
}

module.exports.load = async function() {
  let scheduledJobs;
  logger.info('Load schedules');
  scheduledJobs = await ScheduleModel.list(false);
  if(scheduledJobs.count === 0) return;
  scheduledJobs.data.forEach(function(job) {
    logger.debug(`Load schedule #${job.serial}: ${job.name}`);
    createRamSchedule(job);
  });
};

function isMobileTest(platform) {
  if(!platform) return false;
  platform = platform.toLowerCase();
  if(platform === 'android' || platform === 'ios') {
    return true;
  } else {
    return false;
  }
}

module.exports.createSchedule = async function(name, cron, timezone, params, enabled, callback) {
  let schedule = new ScheduleModel();
  schedule.serial = await scheduleCounter.next();
  schedule.count = 0;
  schedule.name = name;
  schedule.cron = cron;
  schedule.timezone = timezone;
  schedule.enabled = (enabled === false ? false : true);
  schedule.params = params;

  if(isMobileTest(schedule.params.platform)) {
    delete schedule.params._doc['url'];
  } else {
    delete schedule.params._doc['appUrl'];
  }

  // Add a record into the DB scheduler
  ScheduleModel.createSchedule(schedule, function(err, createdSchedule) {
    if(!err) {
      // Add a schedule into the RAM scheduler
      if(enabled) createRamSchedule(createdSchedule);
    }
    callback(err, createdSchedule);
  });
};

module.exports.removeSchedule = function(serial, callback) {
  jobScheduler.cancelJob(serial);
  ScheduleModel.removeSchedule(serial, function(err, data) {
    if(!err) {
      if(data) logger.debug(`Schedule #${data.serial}: ${data.name} is removed from the DB.`);
      else logger.debug('Cannot find a schedule with a serial = ' + serial);
    }
    callback(err, data);
  });
};

module.exports.updateSchedule = function(serial, doc, callback) {
  ScheduleModel.updateSchedule(serial, doc, function(err, oldSchedule) {
    if(!err && oldSchedule) {
      if(oldSchedule) {
        if(typeof doc.enabled !== 'boolean') doc.enabled = oldSchedule.enabled;
        if(oldSchedule.enabled && !doc.enabled) {
          jobScheduler.cancelJob(serial);
        }
        if(!oldSchedule.enabled && doc.enabled) {
          let schedule = {serial: serial, cron: doc.cron || oldSchedule.cron, timezone: doc.timezone || oldSchedule.timezone};
          createRamSchedule(schedule);
        }
        if(doc.enabled && ((doc.cron && oldSchedule.cron !== doc.cron) || (doc.timezone && oldSchedule.timezone !== doc.timezone))) {
          jobScheduler.rescheduleJob(serial, doc.cron || oldSchedule.cron, doc.timezone || oldSchedule.timezone);
        }
        logger.debug(`Schedule ${serial}: ${doc.name || oldSchedule.name} is updated.`);
      } else {
        logger.debug('Cannot find a schedule with a serial = ' + serial);
      }
    } else {
      if(err) logger.error('Failed to update a schedule. ' + err);
      else logger.error('Schedule not found.');
    }
    ScheduleModel.findOne({serial: serial}, function(err, data) {
      callback(err, data);
    });
  });
};
