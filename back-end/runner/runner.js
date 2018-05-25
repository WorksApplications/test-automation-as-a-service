var config = require('../config');
var logger = require('../logger');
var slackbot = require('./slackbot');
var fs = require('fs-extra');
var procPool = require('./process-pool.js');
var queue = require('queue');
var TestJobModel = require('../models/testjobs').Model;
var GroupModel = require('../models/groups').Model;
var TestcaseModel = require('../models/testcases').Model;
var TestcodeModel = require('../models/testcode').Model;
var BranchModel = require('../models/branches').Model;
var DashboardModel = require('../models/dashboard').Model;
var NodeModel = require('../models/nodes').Model;
var ExecStackModel = require('../models/exec-stack').Model;
var TestJobStatus = require('../models/testjobs').Status;
var status = require('./status');
var TypeJob = require('../models/testjobs').TypeJob;
var TypeTrigger = require('../models/testjobs').TypeTrigger;
var counter = require('../counter');
var maven = require('./maven-agent');
require('./runner-logger');
var terminalLogger = require('./runner-logger').terminalLogger;
var git = require('./git-agent');
var mergeStatistic = require('./messageUtil').mergeStatistic;
var recorder = require('./recorder-agent');
var codeScanner = require('./code-scan');
var resultCollector = require('./result-collector');
var docker = require('./docker-agent');
var SocketService = require('../service/socket-service');

var jobQueues = {
  chrome: queue({concurrency: 3, autostart: true}),
  firefox: queue({concurrency: 3, autostart: true}),
  windows: queue({concurrency: 1, autostart: true}),
  android: queue({concurrency: 1, autostart: true}),
  scanner: queue({concurrency: Infinity, autostart: 1}),
  ios: queue({concurrency: 1, autostart: true}),
  api: queue({concurrency: 5, autostart: true})
};
var nodePool = {
  chrome: {},
  firefox: {},
  windows: {},
  android: {},
  ios: {}
};
var activeNodes = {};
var jobSerial = counter('testJobSerial');

function releaseNode(serial) {
  delete activeNodes[serial];
  for(var idx in nodePool) {
    var pool = nodePool[idx];
    for(var idx_node in pool) {
      if(pool[idx_node].usedBy === serial) {
        pool[idx_node].usedBy = -1;
        return;
      }
    }
  }
}

function allocNode(serial, platform) {
  platform = platform.toLowerCase();
  var poolName;
  switch (platform) {
    case 'android':
    case 'ios':
    case 'chrome':
    case 'firefox':
      poolName = platform;
      break;
    case 'internet explorer':
    case 'microsoftedge':
      poolName = 'windows';
      break;
  }
  if(!nodePool || !nodePool[poolName]) return null;
  var pool = nodePool[poolName];
  for(var idx in pool) {
    if(pool[idx].usedBy === -1) {
      pool[idx].usedBy = serial;
      activeNodes[serial] = pool[idx];
      return pool[idx];
    }
  }
  return null;
}

function createNode(serial, ipConf) {
  activeNodes[serial] = {
    driverUrl : `http://${ipConf.ip}:4444/wd/hub`,
    vncHost : ipConf.host,
    vncPort : ipConf.port,
    width : 1920,
    height : 1080
  };
}

module.exports.getNode = function(serial) {
  return activeNodes[serial];
};

/**
 * Archive a test report to a given directory
 *
 * @param {string} source Source directory of a report
 * @param {string} archive Target directory for report archiving (Full path will be created if not exists, overwritten if exists)
 * @param {function(boolean)} callback Callback after the archiving process is finished. Parameter = true if the report is successfully archived.
 */
async function archiveReport(source, archive) {
  var reportFile = `${archive}/data/xunit.json`.replace('//','/');
  try {
    await fs.copy(source, archive);
    var content = await fs.readFile(reportFile);
    return content;
  } catch (err) {
    logger.error('Failed to copy a report. ' + err);
    return undefined;
  }
}

// check mobile test by platform text
function checkMobileTestByPlatform(platform) {
  return platform ? (['android', 'ios'].indexOf(platform.toLowerCase()) !== -1) : false;
}

// check if it is API test by platform text
function checkApiTestByPlatform(platform) {
  return platform ? platform === 'api' : false;
}

function queueSelector(testjob) {
  if(testjob.typeJob === TypeJob.BRH_SCAN || testjob.typeJob === TypeJob.GRP_CASES_SCAN) return jobQueues.scanner;
  if (testjob.typeJob === TypeJob.API) return jobQueues.api;
  var platform = (testjob.params.platform && testjob.params.platform.length) ? testjob.params.platform.toLowerCase() : '';
  switch (platform) {
    case 'android':
      return jobQueues.android;
    case 'chrome':
      return jobQueues.chrome;
    case 'firefox':
      return jobQueues.firefox;
    case 'internet explorer':
    case 'microsoftedge':
      return jobQueues.windows;
    case 'ios':
      return jobQueues.ios;
    default:
      return jobQueues.scanner;
  }
}

function extractCustomizedParams(args, param = []) {
  try {
    param.forEach(function(ele){
      let key = ele.key;
      let value = ele.value;
      if (args[key] === undefined ||
          args[key] === null) {
        args[key] = value;
      }
    });
  } catch (e) {
    logger.warning('Fail to extract customized parameter');
  }
}

async function run(type, branch, target, serial, channel, username, password, platform, testcases, appUrl, params) {
  var workspace = `${config.core.workspace}/${serial}/`.replace('//','/');
  var hostWorkspace = `${config.core.hostWorkspace}/${serial}/`.replace('//','/');
  var reportPath = config.core.reportDir;
  var isTestjob = false;

  // for mobile
  var tenantid = /\w+-develop/g.exec(target)
    ? /\w+-develop/g.exec(target)[0]
    : 'jilli-develop';

  var args = {
    'taas.env.url': target,
    'taas.driver.type': platform,
    'taas.remote.driver.url': `${config.server.path}/internal/testjobs/${serial}/hub`,
    'taas.api.url': `${config.server.path}/internal/testjobs/${serial}`,
    'taas.test.user': username,
    'taas.test.password': password,
    'taas.use.remote.driver': true,
    'taas.platform': platform ? platform.toUpperCase() : 'ANDROID', // for mobile only
    'taas.test.tenantid': tenantid, // for mobile only
    'taas.app': appUrl // for mobile only
  };

  if(testcases) {
    args.test = testcases.join();
    args.failIfNoTests = false;
  }

  extractCustomizedParams(args, params);
  logger.info(args);

  try {
    await git.fetchCode(config.core.repo, branch, workspace, serial, 3, (log, serial) => terminalLogger(log, serial, 'debug'));
    var ret;
    switch (type) {
      case TypeJob.NORMAL:
        if(platform === 'firefox' || platform === 'chrome') {
          await docker.startTest(serial, platform, hostWorkspace, args, (log, serial) => terminalLogger(log, serial, 'debug'));
          var ipConf = await docker.getIpConfig(serial);
          createNode(serial, ipConf);
          logger.debug(`Fill VNC info ${ipConf.ip}:5900 into DB.`);
          await TestJobModel.recordLiveInfo(serial, ipConf.ip, 5900);
          await SocketService.broadcastToTestJobUserOrGroups('live_info', serial, {forceToAllUsers: true}, ipConf.ip, 5900);
          ret = await docker.waitForFinish(serial);
          try {
            await recorder.stopRecord(serial);
          } catch (err) {
            logger.error(err);
          }
          releaseNode(serial);
        } else {
          allocNode(serial, platform);
          var vncHost = activeNodes[serial].vncHost;
          var vncPort = activeNodes[serial].vncPort;
          var vncPassword = activeNodes[serial].vncPassword;
          logger.debug(`Fill VNC info ${vncHost}:${vncPort} into DB.`);
          await TestJobModel.recordLiveInfo(serial, vncHost, vncPort, vncPassword);
          await SocketService.broadcastToTestJobUserOrGroups('live_info', serial, {forceToAllUsers: true}, vncHost, vncPort, vncPassword);
          ret = await maven.test(serial, workspace, args, (log, serial) => terminalLogger(log, serial, 'debug'));
          releaseNode(serial);
          try {
            await recorder.stopRecord(serial);
          } catch (err) {
            logger.error(err);
          }
          if(ret.code === 0) ret = await maven.createReport(serial, workspace, (log, serial) => terminalLogger(log, serial, 'debug'));
        }
        isTestjob = true;
        break;
      case TypeJob.BRH_SCAN:
        ret = await git.listBranches(workspace, serial, (log, serial) => terminalLogger(log, serial, 'debug'));
        break;
      case TypeJob.GRP_CASES_SCAN:
        ret = await maven.deepScan(serial, branch, workspace, (log, serial) => terminalLogger(log, serial, 'debug'));
        break;
      case TypeJob.API:
        ret = await maven.test(serial, workspace, args, (log, serial) => terminalLogger(log, serial, 'debug'));
        if(ret.code === 0) ret = await maven.createReport(serial, workspace, (log, serial) => terminalLogger(log, serial, 'debug'));
        isTestjob = true;
        break;
      default:
        break;
    }

    if(ret.code === 0) {
      logger.info(`Job #${serial} finished successfully!`);
      if(isTestjob) await finishTestjob(workspace, reportPath, channel, serial, target, platform, branch);
      if(type === TypeJob.BRH_SCAN) await finishScanBranches(serial, config.core.repo, ret.branches);
      if(type === TypeJob.GRP_CASES_SCAN) await finishDeepScan(serial, branch, workspace);
    } else if(ret.signal || ret.code === 137) {
      logger.info('Job is canceled by user.');
      await status.setCanceled(serial);
    } else {
      logger.error(`Process exited with code ${ret.code}.`);
      logger.error('Failed to run a job.');
      await status.setError(serial);
    }
    await fs.remove(workspace);
  } catch (err) {
    if(err.message.indexOf('Git operation aborted') !== 0) {
      logger.error(`Failed to fetch code. Test aborted! ${err}`);
      await status.setError(serial);
    } else {
      logger.info('Git operation is canceled');
      await status.setCanceled(serial);
    }
  }
}

async function finishTestjob(workspace, reportPath, channel, serial, target, platform, branch) {
  logger.info(`Archive the report to ${reportPath + serial}`);
  var report = await archiveReport(workspace + 'target/site/allure-maven-plugin', reportPath + serial);
  if(report) {
    var reportUrl = `${config.server.report}/${serial}/index.html`;
    var testjobUrl = `${config.server.root}/#/testjobs/details/${serial}`;
    logger.info('Report archived!');
    if(channel && channel.length > 0) {
      logger.info(`Sending report to slack channel ${channel}`);
      await slackbot.sendReport(reportPath + serial, report, serial, channel, testjobUrl, target);
    }
    await status.setFinished(serial, {reportUrl: reportUrl, result: mergeStatistic(JSON.parse(report))});

    try {
      let results = await resultCollector.collectAndSaveTestReport(`${reportPath + serial}/data`, JSON.parse(report.toString()), serial, platform, branch, reportUrl);
      await DashboardModel.updateTestResults(branch || 'develop', results);
    } catch (e) {
      logger.error('Collect Report Failed: ' + e);
    }

  } else {
    logger.error('Failed to archive a report.');
    await status.setError(serial);
  }
}

async function finishScanBranches(serial, repo, branches) {
  var new_branch;
  try {
    new_branch = await BranchModel.modify(repo, branches);
    logger.info(`Branches for ${new_branch.repo} is updated.`);
    await status.setFinished(serial);
  } catch (err) {
    logger.error('Failed to update branches. ' + err);
    await status.setError(serial);
  }
}

async function finishDeepScan(serial, branch, workspace) {
  var groupFilename = workspace + branch + '_groups.json';
  var testcasesFilename = workspace + branch + '_testcases.json';
  var methodCallsFilename = workspace + branch + '_methodcalls.json';
  try {
    var groups = await fs.readFile(groupFilename);
    groups = JSON.parse(groups.toString());
    var testcases = await fs.readFile(testcasesFilename);
    testcases = JSON.parse(testcases.toString());
    var methodCalls = await fs.readFile(methodCallsFilename);
    methodCalls = JSON.parse(methodCalls.toString());
    await GroupModel.modify(branch, groups);
    await TestcaseModel.modify(branch, testcases);
    await DashboardModel.updateKeys(branch, testcases);
    await codeScanner.readAllCode(methodCalls, workspace);
    await TestcodeModel.modify(branch, methodCalls);
    logger.info(`Testcases & Testcodes for ${branch} branch is updated.`);
    status.setFinished(serial);
  } catch (err) {
    logger.info('Failed to update testcases. ' + err);
    status.setError(serial);
  }
}

function countTestcases(testcases) {
  var bin = {};
  if(!testcases) return 0;
  for(var idx = 0; idx < testcases.length; idx++) {
    var locator = testcases[idx];
    var locator_arr = locator.split('#');
    var package = locator_arr[0];
    var methods;
    if(locator_arr[1]) methods = locator_arr[1].split('+');
    else continue;
    for(var midx in methods) {
      var testcase = package + '.' + methods[midx];
      bin[testcase] = 1;
    }
  }
  return Object.keys(bin).length;
}

module.exports.createScanJob = async function(branch, callback) {
  var scanjob = new TestJobModel();
  scanjob.serial = await jobSerial.next();
  scanjob.create = new Date();
  scanjob.status = TestJobStatus.PENDING;
  scanjob.typeJob = TypeJob.GRP_CASES_SCAN;
  scanjob.typeTrigger = TypeTrigger.NORMAL;
  scanjob.params = {
    name: `Scan test cases for [${branch}] branch`,
    branch: branch
  };
  var job = await TestJobModel.createTestJob(scanjob);
  jobEnqueue(job);
  return job;
};

module.exports.listGitBranches = async function() {
  var scanjob = new TestJobModel();
  scanjob.serial = await jobSerial.next();
  scanjob.create = new Date();
  scanjob.status = TestJobStatus.PENDING;
  scanjob.typeJob = TypeJob.BRH_SCAN;
  scanjob.typeTrigger = TypeTrigger.NORMAL;
  scanjob.params = {
    name: 'Scan for git branches on ' + config.core.repo.split('/').slice(-1)[0],
    branch: 'develop'
  };
  var job = await TestJobModel.createTestJob(scanjob);
  jobEnqueue(job);
  return job;
};

module.exports.createTestJob = async function(parameters, triggeredBy) {
  var testjob = new TestJobModel();
  testjob.serial = await jobSerial.next();
  testjob.create = new Date();
  testjob.status = TestJobStatus.PENDING;
  testjob.videoAvailable = true;
  if(triggeredBy.scheduleSerial) {
    testjob.typeJob = TypeJob.NORMAL;
    testjob.typeTrigger = TypeTrigger.SCHEDULED;
    testjob.scheduleSerial = triggeredBy.scheduleSerial;
  } else if (triggeredBy.testPlanSerial && triggeredBy.taskSerial) {
    testjob.typeJob = TypeJob.NORMAL;
    testjob.typeTrigger = TypeTrigger.TASKED;
    testjob.operator = parameters.operator;
    testjob.testPlanSerial = triggeredBy.testPlanSerial;
    testjob.taskSerial = triggeredBy.taskSerial;
  } else {
    testjob.typeJob = TypeJob.NORMAL;
    testjob.typeTrigger = TypeTrigger.NORMAL;
    testjob.operator = parameters.operator;
  }
  testjob.params = {
    name: parameters.name,
    branch: parameters.branch,
    channel: parameters.channel,
    channelId: parameters.channelId,
    username: parameters.username,
    password: parameters.password,
    platform: parameters.platform,
    groups: parameters.groups,
    testcases: parameters.testcases,
    params: parameters.params
  };

  if(checkMobileTestByPlatform(parameters.platform)) {
    testjob.params.appUrl = parameters.appUrl;
    testjob.params.url = parameters.url;
  } else {
    testjob.params.url = parameters.url;
  }

  if (checkApiTestByPlatform(parameters.platform)) {
    testjob.videoAvailable = false;
    testjob.typeJob = TypeJob.API;
  }

  testjob.result = {
    passed: 0,
    pending: 0,
    canceled: 0,
    failed: 0,
    broken: 0,
    total: countTestcases(parameters.testcases)
  };

  ExecStackModel.recordBranch(testjob.serial, parameters.branch);

  var job = await TestJobModel.createTestJob(testjob);
  jobEnqueue(job);
  return job;
};

function jobEnqueue(testjob) {
  var serial = testjob.serial;
  var params = testjob.params || {};
  var target = params.url;
  var jobQueue = queueSelector(testjob);
  logger.info(`Job #${serial} is created.`);
  var job = async function() {
    await status.setRunning(serial, testjob.testPlanSerial, testjob.taskSerial);
    logger.info('Job started! with target: ' + target);
    await run(testjob.typeJob,
      params.branch,
      target, serial,
      (params.channelId && params.channelId !== '') ? params.channelId : params.channel,
      params.username,
      params.password,
      params.platform,
      params.testcases,
      params.appUrl,
      params.params);
  };
  job.serial = serial;
  jobQueue.push(job);
}

module.exports.cancelTestJob = async function(serial) {
  if(docker.getContainer(serial)) {
    await docker.cancelTest(serial);
    return;
  }
  if(procPool.hasJob(serial)) {
    logger.info(`Cancel Job #${serial}`);
    await procPool.terminate(serial);
  } else {
    var job_status = await status.getStatus(serial);
    if(job_status === TestJobStatus.PENDING || job_status === TestJobStatus.RUNNING) {
      await status.setCanceled(serial);
      var target;
      var jobQueue;
      for(var idx in jobQueues) {
        jobQueue = jobQueues[idx];
        target = jobQueue.jobs.findIndex((job, i) => {
          logger.debug(`Job #${job.serial} in queue`);
          return job.serial === serial;
        });
        if(target >= 0) break;
      }
      if(target >= 0) {
        jobQueue.splice(target, 1);
      } else {
        throw new Error('Job not found.');
      }
    } else if(!job_status) {
      throw new Error('Job not found.');
    } else {
      throw new Error('Job was completed.');
    }
  }
};

module.exports.load = async function() {
  var pendingJobs;
  logger.info('Load pending jobs');
  pendingJobs = await TestJobModel.listPendingJobs();
  if(!pendingJobs) return;
  pendingJobs.forEach(function(job) {
    logger.debug(`Load pending job #${job.serial}: ${job.params.name}`);
    jobEnqueue(job);
  });
};

module.exports.loadNodes = async function() {
  for(var idx in nodePool) {
    if(idx === 'chrome' || idx === 'firefox') continue;
    var nodes = await NodeModel.retrieve(idx);
    jobQueues[idx].concurrency = nodes.length;
    for(var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var id = node.id;
      if(!nodePool[idx][id]) nodePool[idx][id] = {usedBy: -1};
      nodePool[idx][id].id = node._id.toString();
      nodePool[idx][id].name = node.name;
      nodePool[idx][id].platform = node.platform;
      nodePool[idx][id].driverUrl = node.driverUrl;
      nodePool[idx][id].liveUrl = node.liveUrl;
      nodePool[idx][id].vncHost = node.vncHost;
      nodePool[idx][id].vncPort = node.vncPort;
      nodePool[idx][id].vncPassword = node.vncPassword;
      nodePool[idx][id].width = node.width;
      nodePool[idx][id].height = node.height;
    }
  }
};
