var pool = {};
var signals = {};
var spawn = require('child_process').spawn;
var logger = require('../logger');

function waitForTermination(proc, timeout) {
  return new global.Promise(function(resolve, reject) {
    if(timeout === 0) reject();
    var handle = setInterval(function() {
      if(!proc || !hasProcess(proc.pid)) {
        clearInterval(handle);
        resolve();
      }
    }, 100);
    setTimeout(function() {
      clearInterval(handle);
      reject();
    }, timeout);
  });
}

// Promise wrapper around the tree-kill package
function killTree(pid, signal) {
  if(!signal) signal = 'SIGTERM';
  return new global.Promise(function(resolve, reject) {
    var treekill = require('tree-kill');
    treekill(pid, signal, function(err) {
      if(err) reject(err);
      else resolve();
    });
  });
}

function hasProcess(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err)  {
    return false;
  }
}

module.exports.spawn = function(serial, command, args, options, logCallback) {
  serial = serial.toString();
  return new global.Promise(function(resolve, reject) {
    if(pool[serial]) {
      reject(new Error(`Job with serial = ${serial} is already in the pool`));
    }
    var proc = spawn(command, args, options);
    proc.on('error', function(err) {
      logger.error('Failed to spawn or terminate a process. ' + err);
      delete pool[serial];
      reject(err);
    });
    proc.stdout.on('data', function(data) {
      logger.prettify('stdout_' + serial, data.toString())[0].forEach(function(message) {
        if(logCallback) logCallback(message, serial, 'stdout');
      });
    });
    proc.stderr.on('data', function(data) {
      logger.prettify('stdout_' + serial, data.toString())[0].forEach(function(message) {
        if(logCallback) logCallback(message, serial, 'stderr');
      });
    });
    pool[serial] = proc;
    proc.on('exit', function(code, signal) {
      if(signals[proc.pid]) {
        code = null;
        signal = signals[proc.pid];
        delete signals[proc.pid];
      }
      if(code !== null) logger.info(`Process with pid = ${proc.pid} exited with code ${code}`);
      if(signal) logger.info(`Process with pid = ${proc.pid} is terminated by a ${signal} signal`);
      delete pool[serial];
      resolve({signal: signal, code: code});
    });
  });
};

module.exports.terminate = async function(serial, timeout, signal) {
  serial = serial.toString();
  var proc = pool[serial];
  if(timeout === undefined) timeout = 5000;
  if(!signal) signal = 'SIGTERM';
  if(!proc) throw new Error(`Cannot find a job with serial = ${serial}`);
  try {
    // Try gracefully shutdown
    signals[proc.pid] = signal;
    if(timeout !== 0) {
      await killTree(proc.pid, signal);
      logger.debug(`${signal} signal is sent. Wait for graceful shutdown.`);
    }
    await waitForTermination(proc, timeout);
  } catch (err) {
    // Failed to shutdown gracefully
    // Kill process tree using SIGKILL
    delete signals[proc.pid];
    await killTree(proc.pid, 'SIGKILL');
  }
};

module.exports.hasJob = function(serial) {
  serial = serial.toString();
  var proc = pool[serial];
  if(!proc || !hasProcess(proc.pid)) return false;
  else return true;
};
