var Docker = require('dockerode');
var config = require('../config');
var logger = require('../logger');

var docker = new Docker({
  host: config.docker.host,
  port: config.docker.port,
  version: config.docker.apiVersion
});

var containerMapping = {};
var MAX_PORT = 41000;
var portList = [];
for(var i = 40000; i < MAX_PORT; i++) portList[i] = 0;
function allocPort(serial) {
  for(var i = 40000; i < MAX_PORT; i++) {
    if(portList[i] === 0) {
      portList[i] = parseInt(serial);
      return i.toString();
    }
  }
}

function releasePort(serial) {
  serial = parseInt(serial);
  for(var i = 40000; i < MAX_PORT; i++) {
    if(portList[i] === serial) {
      portList[i] = 0;
      break;
    }
  }
}

module.exports.getContainer = function(serial) {
  return containerMapping[serial];
};

module.exports.startTest = async function(serial, platform, hostWorkspace, parameters, logCallback) {
  var args = [];
  for(var key in parameters) {
    args.push(`-D${key}=${parameters[key]}`);
  }
  var containerCfg = {
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    AutoRemove: false,
    Cmd: ['/bin/bash', '-c', `/opt/bin/entry_point.sh > /dev/null; cd /workspace; mvn clean test -e -B -fae -Dmaven.test.failure.ignore=true ${args.join(' ')}; mvn -B ru.yandex.qatools.allure:allure-maven-plugin:2.5:aggregate`],
    OpenStdin: false,
    StdinOnce: false,
    PortBindings: { '5900/tcp': [{ HostPort: allocPort() }] },
    Binds: ['/dev/shm:/dev/shm', `${hostWorkspace}:/workspace`, `${config.core.m2Dir}:/home/seluser/.m2/repository`],
    'NetworkMode': config.docker.network
  };
  if(platform.toLowerCase() === 'chrome') containerCfg.Image = 'intg-chrome-node';
  if(platform.toLowerCase() === 'firefox') containerCfg.Image = 'intg-firefox-node';

  var container = await docker.createContainer(containerCfg);
  container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
    stream.on('data', function(data) {
      logger.prettify('docker_' + serial, data.toString())[0].forEach(function(message) {
        if(logCallback) logCallback(message, serial, 'docker');
      });
    });
  });

  await container.start();
  containerMapping[serial] = container;
  return container;
};

module.exports.getIpConfig = async function(serial) {
  if(!containerMapping[serial]) throw new Error('Container not found');
  var container = containerMapping[serial];
  var info = await container.inspect();
  return {host: config.docker.host,
    ip: info.NetworkSettings.Networks[config.docker.network].IPAddress,
    port: info.NetworkSettings.Ports['5900/tcp'][0].HostPort};
};

module.exports.waitForFinish = function(serial) {
  return new global.Promise((resolve, reject) => {
    if(!containerMapping[serial]) reject(new Error('Container not found'));
    var container = containerMapping[serial];
    if(!container || typeof container.inspect !== 'function') resolve();
    var handler = setInterval(async () => {
      var info = await container.inspect();
      if(!info || !info.State || !info.State.Running) {
        clearTimeout(handler);
        releasePort(serial);
        await container.remove();
        delete containerMapping[serial];
        if(info.State.ExitCode === 0) resolve({code: 0, signal: null});
        else resolve({code: info.State.ExitCode, signal: null});
      }
    }, 1000);
  });
};

module.exports.cancelTest = async function(serial) {
  if(!containerMapping[serial]) throw new Error('Container not found');
  var container = containerMapping[serial];
  await container.kill();
  delete containerMapping[serial];
};
