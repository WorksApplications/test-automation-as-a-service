var winston = require('winston');
var config = require('./config');
var fs = require('fs-extra');

var logdir = __dirname + '/' + config.logger.fileLogger.filename.split('/').slice(0, -1).join('/');
if(fs.existsSync(logdir)) {
  console.log(`Use ${logdir} for logging`);
} else {
  console.log(`Create ${logdir} for logging`);
  fs.ensureDirSync(logdir);
}

var loggerCfg = {
  transports: [
    new winston.transports.File(config.logger.fileLogger)
  ],
  exitOnError: false
};

var accessLoggerCfg = {
  transports: [
    new winston.transports.File(config.logger.accessLogger)
  ],
  exitOnError: false
};

if(process.env.NODE_ENV !== 'test') {
  loggerCfg.transports.push(new winston.transports.Console(config.logger.consoleLogger));
  accessLoggerCfg.transports.push(new winston.transports.Console(config.logger.consoleLogger));
}

var logger = new winston.Logger(loggerCfg);
logger.accessLogger = new winston.Logger(accessLoggerCfg);
logger.accessLogger.stream = {
  write: function(message, encoding){
    logger.accessLogger.info(message.replace('\n', ' '));
  }
};

var logCache = {};
/**
 * Cache the log until see an LF character or split a string into multiple records if it has multiple lines.
 *
 * @param {string} cacheName A string specify a name for a cache. Calls with same cacheNames will be cached into the same cache
 * @param {string} str Log string that need to be processed
 * @returns
 */
logger.prettify = function(cacheName, str) {
  //console.log('--------------------------------: ' + str.replace(/\n/g, '[N]'));
  if(logCache[cacheName] == undefined) logCache[cacheName] = '';
  str = logCache[cacheName] + str;
  var arr = str.split('\n');
  var isEndWithLF = function(str) { return str[str.length -1] === '\n'; };
  var filterEmpty = function(ele) { return ele !== ''; };

  if(isEndWithLF(str)) {
    logCache[cacheName] = '';
  } else {
    if(arr.length > 0) {
      logCache[cacheName] = arr[arr.length - 1];
    }
    arr = arr.slice(0, -1);
  }

  arr = arr.filter(filterEmpty);

  return [arr, logCache[cacheName]];
};

/**
 * Generate a pretty log output.
 *
 * @param {string} cacheName A string specify a name for a cache. Calls with same cacheNames will be cached into the same cache
 * @param {string} level Log level: error, debug, info, etc.
 * @param {string} str Log string that need to be processed
 * @returns
 */
logger.prettyLog = function (cacheName, level, str) {
  this.prettify(cacheName, str)[0].forEach(function(ele) {
    logger.log(level, ele);
  });
};

module.exports = logger;
