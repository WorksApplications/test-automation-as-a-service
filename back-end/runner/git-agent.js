var logger = require('../logger');
var procPool = require('./process-pool');
var fs = require('fs-extra');

async function git(serial, cwd, args, logCallback) {
  var options = {
    cwd: cwd,
    env: {
      HOME: process.env.HOME,
      PATH: process.env.PATH
    },
    stdio: 'pipe',
    detached: false,
    shell: false
  };
  var ret = await procPool.spawn(serial, 'git', args, options, logCallback);
  return ret;
}

async function listBranches(dest, serial, logCallback) {
  var raw = '';
  logger.info('Listing git branches...');
  var ret = await git(serial, dest, ['ls-remote', '--heads', 'origin'], (log, serial) => {
    raw += log + '\n';
    if(logCallback) logCallback(log, serial, 'debug');
  });
  if(ret.signal !== null) {
    throw new Error(`Git operation aborted by ${ret.signal}`);
  } else if(ret.code !== 0) {
    throw new Error(`Git exited with code ${ret.code}.`);
  } else {
    var retArray = raw.split('\n').slice(0, -1).map((ele) => ele.split('\t')[1].split('/').slice(-1)[0]);
    logger.info(`Total ${retArray.length} git branches are retrieved.`);
    ret.branches = retArray;
    return ret;
  }
}

/**
 * Fetch latest source code to a given directory with given repository and branch
 *
 * @param {string} repo Git repository
 * @param {string} branch Git branch
 * @param {string} dest Destination directory to save the code
 * @param {number} retry Max retry times while fetching code, default = 3
 * @param {function(boolean)} callback Callback after code is fetched. Parameter = true if code is successfully fetched.
 */
async function fetchCode(repo, branch, dest, serial, retry, logCallback) {
  var attempt;
  if(typeof(retry) === 'function') {
    logCallback = retry;
    retry = undefined;
  }
  retry = parseInt(retry);
  if(isNaN(retry)) retry = 3;

  await fs.emptyDir(dest);

  for(attempt = 1; ; attempt++) {
    if(attempt > retry) {
      throw new Error('Retry limit reached');
    }
    logger.info(`Attempt #${attempt}: Cloning code from ${repo}`);
    var ret = await git(serial, dest, ['clone', '-b', branch, '--depth=1', repo, '.'], logCallback);
    if(ret.signal !== null) {
      throw new Error(`Git operation aborted by ${ret.signal}`);
    } else if(ret.code !== 0) {
      logger.error(`Failed to clone from ${repo}. Retry later.`);
    } else {
      logger.info('Code fetched successfully.');
      await procPool.spawn(serial, 'chmod', ['-R', '777', dest]);
      break;
    }
  }
}

module.exports.fetchCode = fetchCode;
module.exports.listBranches = listBranches;
