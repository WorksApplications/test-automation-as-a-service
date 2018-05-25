var procPool = require('./process-pool');
var logger = require('./logger');
var fs = require('fs-extra');
var config = require('./config');
var files = {};

module.exports.startRecord = async function(serial, host, port, filename, options) {
  if(procPool.hasJob(`REC-${serial}`)) {
    throw new Error('Ignoring the start of recording.');
  }
  var workspace = `${config.core.workspace}/${serial}/`.replace('//','/');
  var spawn_options = {
    env: {
      HOME: process.env.HOME,
      PATH: process.env.PATH
    },
    stdio: 'pipe',
    detached: false,
    shell: false
  };
  var args = ['-o', filename];
  if(options) {
    if(options.fps) args.push('-r', options.fps);
    if(options.keyframe) args.push('-K', options.keyframe);
    if(options.password) {
      await fs.outputFile(workspace + 'vncpwd', options.password);
      args.push('-P', workspace + 'vncpwd');
    }
    //if(options.noMouse) args.push('-N');
    //if(options.encoding) args.push('-e', options.encoding);
    if(options.blockSize) args.push('-B', options.blockSize);
    if(options.clipping) args.push('-C', options.clipping);
    if(options.command) args.push('-S', options.command);
    if(options.debug) args.push('-d');
  }
  args.push(host, port);
  var runRecorder = new global.Promise(function(resolve, reject) {
    var timeout = setTimeout(() => {
      logger.error('Failed to start video recording');
      resolve();
    }, 3000);
    procPool.spawn(`REC-${serial}`, 'flvrec.py', args, spawn_options, log => {
      logger.debug('[FLVREC] ' + log);
      if(log.indexOf('start recording') !== -1) {
        logger.info('Video recorder started!');
        files[serial.toString()] = filename;
        clearTimeout(timeout);
        resolve();
      }
    });
  });
  await runRecorder;
};

async function stopRecord(serial) {
  var pwdFile = `${config.core.workspace}/${serial}/`.replace('//','/') + 'vncpwd';
  var fileExists;
  try {
    await procPool.terminate(`REC-${serial}`, 3000, 'SIGINT');
    fileExists = await fs.exists(pwdFile);
    if(fileExists) {
      await fs.unlink(pwdFile);
      logger.info('VNC password file removed.');
    }
    logger.log('Video record finished.');
  } catch (err) {
    logger.error('Error occured when stopping a record. ' + err);
    throw err;
  }
}

module.exports.stopRecord = stopRecord;

module.exports.cancelRecord = async function(serial) {
  serial = serial.toString();
  var pwdFile = `${config.core.workspace}/${serial}/`.replace('//','/') + 'vncpwd';
  var fileExists;
  try {
    await stopRecord(serial);
    fileExists = await fs.exists(files[serial]);
    if(fileExists) {
      await fs.unlink(files[serial]);
      logger.info('Temporary video file deleted.');
    }
    fileExists = await fs.exists(pwdFile);
    if(fileExists) {
      await fs.unlink(pwdFile);
      logger.info('VNC password file removed.');
    }
  } catch (err) {
    logger.error('Error occured when canceling a record' + err);
  }
};
