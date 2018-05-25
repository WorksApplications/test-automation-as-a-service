var app = require('express')();
var server = require('http').createServer(app);
var morgan = require('morgan');
var router = require('./router/router');
var config = require('./config');
var logger = require('./logger');
var accessLogger = require('./logger').accessLogger;

app.use(morgan(config.logger.morganFormat, { stream: accessLogger.stream }));
app.use('/', router);

//get real ip if passed by nginx
morgan.token('remote-addr', function (req) {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

server.listen(config.server.port, config.server.host, function() {
  logger.info('Web service is started on ' + config.server.host + ':' + config.server.port);
  app.emit('taas-ready');
});

module.exports = app;
