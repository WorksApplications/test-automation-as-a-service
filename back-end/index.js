var db = require('./db');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var morgan = require('morgan');
var router = require('./router/router');
var config = require('./config');
var logger = require('./logger');
var SocketContext = require('./socket-context');
var accessLogger = require('./logger').accessLogger;
var scheduler = require('./runner/scheduler');
var runner = require('./runner/runner');
var cookieParser = require('cookie-parser');
var AuthServiceMiddleware = require('./service').AuthService.auth;
var ApiTokenAuthMiddleware = require('./service').AuthService.apiTokenAuth;

// Root directory of this service
global.__base = __dirname;

// Stream morgan log to the winston logger
app.use(morgan(config.logger.morganFormat, { stream: accessLogger.stream }));

// cookie parser
app.use(cookieParser());

//get real ip if passed by nginx
morgan.token('remote-addr', function (req) {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

app.use('/', AuthServiceMiddleware); // user token auth
app.use('/app', ApiTokenAuthMiddleware); // api token auth
app.use('/', router);

(async function() {
  await db.connect();
  await scheduler.load();
  await runner.load();
  await runner.loadNodes();
  (new SocketContext()).init(io);
  server.listen(config.server.port, config.server.host, function() {
    logger.info('Web service is started on ' + config.server.host + ':' + config.server.port);
    app.emit('taas-ready');
  });
})();

module.exports = app;
