var mongoose = require('mongoose');
var config = require('./config');
var logger = require('./logger');

mongoose.Promise = global.Promise;

module.exports.connect = function() {
  return new global.Promise(function(resolve, reject) {
    var url = 'mongodb://';
    if(config.database.username && config.database.password) url += config.database.username + ':' + config.database.password + '@';
    url += config.database.host;
    if(config.database.port) url += ':' + config.database.port;
    url += '/' + config.database.dbname;

    mongoose.connect(url, {
      useMongoClient: true,
      reconnectTries: 5
    }).catch(function(err) {
      logger.error(`Failed to connect to ${url}. ${err}`);
      reject(err);
    });

    var db = mongoose.connection;
    db.on('error', function(err) {
      logger.error('Database error! ' + err);
      reject(err);
    });

    db.once('open', function() {
      logger.info('Connected to the database!');
      resolve();
    });
  });
};
